const fs = require('fs');
const path = require('path');

function main() {
  const savePath = path.resolve(__dirname, '../codequest_save_all_completed.json');
  const data = JSON.parse(fs.readFileSync(savePath, 'utf8'));

  const listsRoomState = {
    "mode": "blocks",
    "blocksState": {
      "blocks": {
        "languageVersion": 0,
        "blocks": [
          {
            "type": "on_start",
            "id": "start",
            "x": 380,
            "y": 30,
            "deletable": false,
            "inputs": {
              "STACK": {
                "block": {
                  "type": "variables_set",
                  "id": "set_turns",
                  "fields": {
                    "VAR": {
                      "id": "turns"
                    }
                  },
                  "inputs": {
                    "VALUE": {
                      "block": {
                        "type": "lists_create_with",
                        "id": "create_list",
                        "extraState": {
                          "itemCount": 4
                        },
                        "inputs": {
                          "ADD0": {
                            "block": {
                              "type": "math_number",
                              "id": "num_1_a",
                              "fields": {
                                "NUM": 1
                              }
                            }
                          },
                          "ADD1": {
                            "block": {
                              "type": "math_number",
                              "id": "num_2_a",
                              "fields": {
                                "NUM": 2
                              }
                            }
                          },
                          "ADD2": {
                            "block": {
                              "type": "math_number",
                              "id": "num_1_b",
                              "fields": {
                                "NUM": 1
                              }
                            }
                          },
                          "ADD3": {
                            "block": {
                              "type": "math_number",
                              "id": "num_2_b",
                              "fields": {
                                "NUM": 2
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "next": {
                    "block": {
                      "type": "controls_for",
                      "id": "loop_for",
                      "fields": {
                        "VAR": {
                          "id": "i"
                        }
                      },
                      "inputs": {
                        "FROM": {
                          "block": {
                            "type": "math_number",
                            "id": "from_num",
                            "fields": {
                              "NUM": 0
                            }
                          }
                        },
                        "TO": {
                          "block": {
                            "type": "math_number",
                            "id": "to_num",
                            "fields": {
                              "NUM": 3
                            }
                          }
                        },
                        "BY": {
                          "block": {
                            "type": "math_number",
                            "id": "by_num",
                            "fields": {
                              "NUM": 1
                            }
                          }
                        },
                        "DO": {
                          "block": {
                            "type": "move_forward",
                            "id": "mv_fwd_1",
                            "next": {
                              "block": {
                                "type": "move_forward",
                                "id": "mv_fwd_2",
                                "next": {
                                  "block": {
                                    "type": "collect_ruby",
                                    "id": "coll_ruby",
                                    "next": {
                                      "block": {
                                        "type": "controls_if",
                                        "id": "if_block",
                                        "extraState": {
                                          "hasElse": true
                                        },
                                        "inputs": {
                                          "IF0": {
                                            "block": {
                                              "type": "logic_compare",
                                              "id": "comp_block",
                                              "fields": {
                                                "OP": "EQ"
                                              },
                                              "inputs": {
                                                "A": {
                                                  "block": {
                                                    "type": "lists_getIndex",
                                                    "id": "get_index",
                                                    "fields": {
                                                      "MODE": "GET",
                                                      "WHERE": "FROM_START"
                                                    },
                                                    "inputs": {
                                                      "VALUE": {
                                                        "block": {
                                                          "type": "variables_get",
                                                          "id": "get_turns",
                                                          "fields": {
                                                            "VAR": {
                                                              "id": "turns"
                                                            }
                                                          }
                                                        }
                                                      },
                                                      "AT": {
                                                        "block": {
                                                          "type": "variables_get",
                                                          "id": "get_i",
                                                          "fields": {
                                                            "VAR": {
                                                              "id": "i"
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                },
                                                "B": {
                                                  "block": {
                                                    "type": "math_number",
                                                    "id": "one_num",
                                                    "fields": {
                                                      "NUM": 1
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          },
                                          "DO0": {
                                            "block": {
                                              "type": "turn_left",
                                              "id": "turn_l"
                                            }
                                          },
                                          "ELSE": {
                                            "block": {
                                              "type": "turn_right",
                                              "id": "turn_r"
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "next": {
                        "block": {
                          "type": "move_forward",
                          "id": "mv_fwd_end"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    },
    "pythonCode": "def on_start():\n  turns = [1, 2, 1, 2]\n  for i in range(4):\n    hero.move_forward()\n    hero.move_forward()\n    hero.collect_ruby()\n    if turns[i] == 1:\n      hero.turn_left()\n    else:\n      hero.turn_right()\n  hero.move_forward()\n"
  };

  data.levelsCode["lists/room1"] = listsRoomState;

  fs.writeFileSync(savePath, JSON.stringify(data, null, 2));
  console.log("Simplified lists/room1 level save state successfully!");
}

main();
