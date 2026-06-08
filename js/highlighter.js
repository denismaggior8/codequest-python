// Code quest - Code Syntax Highlighter

// Code Highlighter
function updateCodeOutput(highlightLine = null) {
  const pyTextarea = document.getElementById('python-textarea');
  const backdrop = document.getElementById('editor-highlight-backdrop');
  if (pyTextarea && backdrop) {
    backdrop.innerHTML = highlightPython(pyTextarea.value) + '\n';
  }

  const outputEl = document.getElementById('python-output');
  if (!outputEl) return;
  
  if (currentMode === 'python') {
    const pyCode = pyTextarea ? pyTextarea.value : '';
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
  const funcs = [];
  const kws = [];
  const nums = [];
  
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
  
  // 4. Protect functions and methods
  // First, protect method calls on hero (e.g. hero.move_forward, hero.anything)
  processed = processed.replace(/\b(hero\.\w+)\b/g, (match) => {
    funcs.push(match);
    return `__FUNC_PLACEHOLDER_${funcs.length - 1}__`;
  });
  
  // Then, protect any word followed by an opening parenthesis (e.g. print(, on_start(, my_func()
  const keywords = ['def', 'for', 'in', 'range', 'if', 'else', 'while', 'return', 'pass'];
  processed = processed.replace(/\b(\w+)(?=\s*\()/g, (match) => {
    if (match.startsWith('__') || keywords.includes(match)) {
      return match;
    }
    funcs.push(match);
    return `__FUNC_PLACEHOLDER_${funcs.length - 1}__`;
  });
  
  // 5. Protect keywords
  keywords.forEach(kw => {
    const regex = new RegExp('\\b(' + kw + ')\\b', 'g');
    processed = processed.replace(regex, (match) => {
      kws.push(match);
      return `__KW_PLACEHOLDER_${kws.length - 1}__`;
    });
  });
  
  // 6. Protect numbers
  processed = processed.replace(/\b(\d+)\b/g, (match) => {
    nums.push(match);
    return `__NUM_PLACEHOLDER_${nums.length - 1}__`;
  });
  
  // 7. Escape HTML characters
  let escaped = processed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // 8. Replace placeholders with actual HTML spans
  escaped = escaped.replace(/__KW_PLACEHOLDER_(\d+)__/g, (match, id) => {
    const originalKw = kws[parseInt(id)];
    return `<span class="py-kw">${originalKw}</span>`;
  });

  escaped = escaped.replace(/__FUNC_PLACEHOLDER_(\d+)__/g, (match, id) => {
    const originalFunc = funcs[parseInt(id)];
    const escapedFunc = originalFunc
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<span class="py-func">${escapedFunc}</span>`;
  });

  escaped = escaped.replace(/__NUM_PLACEHOLDER_(\d+)__/g, (match, id) => {
    const originalNum = nums[parseInt(id)];
    return `<span class="py-num">${originalNum}</span>`;
  });
  
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
