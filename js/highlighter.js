// Code quest - Code Syntax Highlighter

// Code Highlighter
function updateCodeOutput(highlightLine = null) {
  const outputEl = document.getElementById('python-output');
  if (!outputEl) return;
  
  if (currentMode === 'python') {
    const pyCode = document.getElementById('python-textarea').value;
    if (pyCode.trim() === "") {
      outputEl.innerHTML = `<span class="py-comment">${t('dragSpells')}</span>`;
      return;
    }
    let html = highlightPython(pyCode);
    if (highlightLine !== null) {
      const lines = html.split('\n');
      if (highlightLine - 1 >= 0 && highlightLine - 1 < lines.length) {
        lines[highlightLine - 1] = `<span class="highlighted-code-line">${lines[highlightLine - 1]}</span>`;
      }
      html = lines.join('\n');
    }
    outputEl.innerHTML = html;
    return;
  }
  
  const pyGen = Blockly.Python || (window.python && window.python.pythonGenerator);
  let code = (pyGen && workspace) ? pyGen.workspaceToCode(workspace) : '';
  
  // Clean block_id parameters from the visual scroll representation
  code = code.replace(/(?:,\s*)?block_id=['"][^'"]*['"]/g, '');
  
  if (code.trim() === "") {
    outputEl.innerHTML = `<span class="py-comment">${t('dragSpells')}</span>`;
    return;
  }
  
  let html = highlightPython(code);
  if (highlightLine !== null) {
    const lines = html.split('\n');
    if (highlightLine - 1 >= 0 && highlightLine - 1 < lines.length) {
      lines[highlightLine - 1] = `<span class="highlighted-code-line">${lines[highlightLine - 1]}</span>`;
    }
    html = lines.join('\n');
  }
  outputEl.innerHTML = html;
}

function highlightPython(code) {
  const strings = [];
  const comments = [];
  
  // 1. Protect triple-quoted strings (multiline)
  let processed = code.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, (match) => {
    strings.push(match);
    return `__STR_PLACEHOLDER_${strings.length - 1}__`;
  });
  
  // 2. Protect single/double quoted strings
  processed = processed.replace(/(['"])(.*?)\1/g, (match) => {
    strings.push(match);
    return `__STR_PLACEHOLDER_${strings.length - 1}__`;
  });
  
  // 3. Protect comments
  processed = processed.replace(/(#[^\n]*)/g, (match) => {
    comments.push(match);
    return `__COM_PLACEHOLDER_${comments.length - 1}__`;
  });
  
  // 4. Highlight functions
  const funcs = ['hero\\.move_forward', 'hero\\.collect_ruby', 'hero\\.turn_left', 'hero\\.turn_right', 'hero\\.scan_ahead', 'print', 'hero\\.unlock_gate'];
  funcs.forEach(f => {
    const regex = new RegExp('\\b(' + f + ')\\b', 'g');
    processed = processed.replace(regex, '__FUNC_START__$1__FUNC_END__');
  });
  
  // 5. Highlight keywords
  const keywords = ['def', 'for', 'in', 'range', 'if', 'else', 'while', 'return', 'pass'];
  keywords.forEach(kw => {
    const regex = new RegExp('\\b(' + kw + ')\\b', 'g');
    processed = processed.replace(regex, '__KW_START__$1__KW_END__');
  });
  
  // 6. Highlight numbers
  processed = processed.replace(/\b(\d+)\b/g, '__NUM_START__$1__NUM_END__');
  
  // 7. Escape HTML characters
  let escaped = processed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // 8. Replace placeholders with actual HTML spans
  escaped = escaped.replace(/__KW_START__(.*?)__KW_END__/g, '<span class="py-kw">$1</span>');
  escaped = escaped.replace(/__FUNC_START__(.*?)__FUNC_END__/g, '<span class="py-func">$1</span>');
  escaped = escaped.replace(/__NUM_START__(.*?)__NUM_END__/g, '<span class="py-num">$1</span>');
  
  escaped = escaped.replace(/__STR_PLACEHOLDER_(\d+)__/g, (match, id) => {
    const originalStr = strings[parseInt(id)];
    const escapedStr = originalStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<span class="py-str">${escapedStr}</span>`;
  });
  
  escaped = escaped.replace(/__COM_PLACEHOLDER_(\d+)__/g, (match, id) => {
    const originalCom = comments[parseInt(id)];
    const escapedCom = originalCom
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<span class="py-comment">${escapedCom}</span>`;
  });
  
  return escaped;
}
