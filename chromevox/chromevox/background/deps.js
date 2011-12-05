// This file was autogenerated by /home/build/nonconf/google3/javascript/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../chromevis/injected/lens.js', ['chromevis.ChromeVisLens'], ['cvox.SelectionUtil']);
goog.addDependency('../chromevox/background/accessibility_api_handler.js', ['cvox.AccessibilityApiHandler'], ['cvox.AbstractEarcons', 'cvox.AbstractTts', 'cvox.ChromeVoxEditableTextBase']);
goog.addDependency('../chromevox/background/background.js', ['cvox.ChromeVoxBackground'], ['cvox.AccessibilityApiHandler', 'cvox.ChromeVox', 'cvox.ChromeVoxEditableTextBase', 'cvox.ChromeVoxPrefs', 'cvox.EarconsBackground', 'cvox.ExtensionBridge', 'cvox.Msgs', 'cvox.TtsBackground']);
goog.addDependency('../chromevox/background/prefs.js', ['cvox.ChromeVoxPrefs'], ['cvox.ChromeVox', 'cvox.ExtensionBridge']);
goog.addDependency('../common/aria_util.js', ['cvox.AriaUtil'], ['cvox.AbstractEarcons']);
goog.addDependency('../common/chromevox.js', ['cvox.ChromeVox'], ['cvox.AbstractMsgs']);
goog.addDependency('../common/chromevox_json.js', ['cvox.ChromeVoxJSON'], []);
goog.addDependency('../common/custom_walker.js', ['cvox.CustomWalker'], []);
goog.addDependency('../common/dom_util.js', ['cvox.DomUtil'], ['cvox.AbstractEarcons', 'cvox.AriaUtil', 'cvox.NavDescription', 'cvox.XpathUtil']);
goog.addDependency('../common/editable_text.js', ['cvox.ChromeVoxEditableContentEditable', 'cvox.ChromeVoxEditableHTMLInput', 'cvox.ChromeVoxEditableTextArea', 'cvox.ChromeVoxEditableTextBase', 'cvox.TextChangeEvent'], ['cvox.DomUtil']);
goog.addDependency('../common/focus_util.js', ['cvox.FocusUtil'], []);
goog.addDependency('../common/interframe.js', ['cvox.Interframe'], ['cvox.ChromeVoxJSON']);
goog.addDependency('../common/key_util.js', ['cvox.KeyUtil'], ['cvox.ChromeVox']);
goog.addDependency('../common/linear_dom_walker.js', ['cvox.LinearDomWalker'], ['cvox.DomUtil', 'cvox.XpathUtil']);
goog.addDependency('../common/nav_description.js', ['cvox.NavDescription'], ['cvox.AbstractTts', 'cvox.ChromeVox']);
goog.addDependency('../common/selection_util.js', ['cvox.SelectionUtil'], ['cvox.DomUtil', 'cvox.XpathUtil']);
goog.addDependency('../common/selection_walker.js', ['cvox.SelectionWalker'], ['cvox.SelectionUtil', 'cvox.TraverseContent']);
goog.addDependency('../common/smart_dom_walker.js', ['cvox.SmartDomWalker'], ['cvox.AriaUtil', 'cvox.DomUtil', 'cvox.LinearDomWalker', 'cvox.TraverseTable', 'cvox.XpathUtil']);
goog.addDependency('../common/table_util.js', ['cvox.TableUtil'], ['cvox.XpathUtil']);
goog.addDependency('../common/traverse_content.js', ['cvox.TraverseContent'], ['cvox.DomUtil', 'cvox.SelectionUtil', 'cvox.TraverseUtil']);
goog.addDependency('../common/traverse_table.js', ['cvox.TraverseTable'], ['cvox.SelectionUtil', 'cvox.TableUtil', 'cvox.TraverseUtil']);
goog.addDependency('../common/traverse_util.js', ['Cursor', 'cvox.TraverseUtil'], []);
goog.addDependency('../common/xpath_util.js', ['cvox.XpathUtil'], []);
goog.addDependency('../host/chrome/earcons.js', ['cvox.Earcons'], ['cvox.AbstractEarcons', 'cvox.ExtensionBridge']);
goog.addDependency('../host/chrome/earcons_background.js', ['cvox.EarconsBackground'], ['cvox.AbstractEarcons']);
goog.addDependency('../host/chrome/extension_bridge.js', ['cvox.ExtensionBridge'], ['cvox.ChromeVoxJSON']);
goog.addDependency('../host/chrome/host.js', ['cvox.Host'], ['chromevis.ChromeVisLens', 'cvox.AbstractHost', 'cvox.ExtensionBridge']);
goog.addDependency('../host/chrome/msgs.js', ['cvox.Msgs'], ['cvox.AbstractMsgs']);
goog.addDependency('../host/chrome/tts.js', ['cvox.Tts'], ['cvox.AbstractTts']);
goog.addDependency('../host/chrome/tts_background.js', ['cvox.TtsBackground'], ['cvox.AbstractTts', 'cvox.ChromeVox']);
goog.addDependency('../host/interface/abstract_earcons.js', ['cvox.AbstractEarcons'], []);
goog.addDependency('../host/interface/abstract_host.js', ['cvox.AbstractHost'], []);
goog.addDependency('../host/interface/abstract_msgs.js', ['cvox.AbstractMsgs'], []);
goog.addDependency('../host/interface/abstract_tts.js', ['cvox.AbstractTts'], []);