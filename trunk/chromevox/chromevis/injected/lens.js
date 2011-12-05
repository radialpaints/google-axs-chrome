// Copyright 2010 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Creates a CSS lens for displaying magnified text.
 * @author rshearer@google.com (Rachel Shearer)
 */


goog.provide('chromevis.ChromeVisLens');

goog.require('cvox.SelectionUtil');

/**
 * Constructor for CSS lens. Initializes the lens settings.
 * @constructor
 */
chromevis.ChromeVisLens = function() {

  /**
   * The current amount of padding (in pixels) between the text
   * and the sides of the lens
   * @type {number}
   * @private
   */
  this.padding_ = 5;

  /**
   * The maximum width of the bubble lens (in pixels)
   * @type {number}
   * @private
   */
  this.maxBubbleWidth_ = 700;

  /**
   * The minimum width of the bubble lens (in pixels)
   * @type {number}
   * @private
   */
  this.minBubbleWidth_ = 25;

  /**
   * Whether or not the lens is currently displayed
   * @type {boolean}
   * @private
   */
  this.isLensDisplayed_ = false;

  /**
   * Whether or not the lens is currently centered
   * @type {boolean}
   */
  this.isCentered = true;

  /**
   * The current magnification multiplier
   * @type {number}
   */
  this.multiplier = 1.5;

  /**
   * The current text color
   * @type {string}
   */
  this.textColor = '#FFFFFF';

  /**
   * The current lens background color
   * @type {string}
   */
  this.bgColor = '#000000';

  /**
   * Whether the lens is currently anchored
   * @type {boolean}
   */
  this.isAnchored = true;

  /**
   * Whether the lens is currently at the bottom of the page
   * @type {boolean}
   */
  this.isAtBottom = false;

  /**
   * The maximum number of utterances to display.
   */
  this.maxHistory = 20;

  /**
   * The current ChromeVis lens object
   * @type {Element}
   */
  this.lens = chromevis.ChromeVisLens.ACTIVE_DOC.createElement('span');

  this.initializeLens_();
};


/**
 * The name of the special div that contains settings specified by the
 * background page
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.EL_ID = 'chromeVisBackground2LensDiv';

/**
 * The name of the attribute specifying whether the lens is centered
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.CENTER_ATTRB = 'data-isCentered';

/**
 * The name of the attribute specifying the lens magnification
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.MULT_ATTRB = 'data-textMag';

/**
 * The name of the attribute specifying the lens text color
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.TXT_COLOR_ATTRB = 'data-textColor';

/**
 * The name of the attribute specifying the lens background color
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.BG_COLOR_ATTRB = 'data-bgColor';

/**
 * The name of the attribute specifying whether the lens is anchored
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.ANCHOR_ATTRB = 'data-isAnchored';

/**
 * The active document
 * @type {Document}
 * @const
 */
chromevis.ChromeVisLens.ACTIVE_DOC = window.document;

/**
 * The down arrow image url
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.DOWN_ARROW_IMG = 'url(data:image/png;base64,iVBORw0KG' +
    'goAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/o' +
    'L2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sIFxETCtVNA2AAAADfSURBVEjH7' +
    'dYhbsMwFAbgzwNFRSO9wu4xEtIbjPQUJYW95NDAwEBASVHBPPIiRWuWJqvVSpWf9EAc25/0l' +
    'F9Kyjm7Rz25U1X48WE557PGCosC1y+wGjT+gOEN+yvQfdxhLgwNPrCdAW7jTDM61QswPKPFA' +
    'ZsRcBN72jjjWhiW+ELGJ9a9d+tYy7FnOek7mgh3eBtAxnt099wOoSXgbuzHHtb18fd4/wuPx' +
    'ekFpx56irWbxOkV39HNreO0i65xqnEqAs+NU1F4apxG4TQEpZSm4LteXi/CZ0b9va1whUvVD' +
    '/4KNUmuLLOGAAAAAElFTkSuQmCC)';

/**
 * The up arrow image url
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.UP_ARROW_IMG = 'url(data:image/png;base64,iVBORw0KGgo' +
    'AAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2' +
    'nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sIFxETL55J1ycAAADYSURBVEjH7ZY' +
    '9CoNAEEbfhmBlZeMVco80Nt4gjaewsfSSqVKkSGGRxsoik2YE8S+r7CKE/WAQZ2f3ofJAIyI' +
    'ckRMHJYAD2FvOc01jjM3eSq/1r8FZZUVkUha5Ah+tzAY8YewAX4AOEK1Oe17BCdAOoH21uuY' +
    'FHAPNAHbX6u8bnXEKjoGXAp5APljLtSc6E7sCJ/o0b6BY+QyFzjTj174HnAEPoFzQqZrpl7o' +
    'n2wu+rThqo1OtZ2wCp0DkQKcISINOQaetOi3Fq042ca7TlizqZMJ/dQD/HfgLITIyT/EcAMM' +
    'AAAAASUVORK5CYII=)';

/**
 * The plus image url
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.PLUS_IMG = 'url(data:image/png;base64,iVBORw0KGgoAAAA' +
    'NSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwA' +
    'AAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sIFxEULqYPcXYAAABdSURBVEjHY/z//z/' +
    'DQAAmhgECoxYPf4tZcEkwMjIS0lsOpTvxKcKVaxhxShC2GKaRkRyLRxPXqMUjy2IXaJbBhZG' +
    'zFS7sMuh8PFqAjFo8avHQt5hxtF09avGwsxgA9Zcmqe0ELNkAAAAASUVORK5CYII=)';

/**
 * The minus image url
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.MINUS_IMG = 'url(data:image/png;base64,iVBORw0KGgoAAA' +
    'ANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkw' +
    'AAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sIFxEVDGp0AdMAAAA9SURBVEjH7dWxCQ' +
    'AwDANBK2T/lT8bBFzZxasWHKoUoCZyaijCwsLCwvvh2ykn+V4ZkPWL4x8LCwsLC6+DHwVvCj' +
    'ekahO+AAAAAElFTkSuQmCC)';

/**
 * The cross image url
 * @type {string}
 * @const
 */
chromevis.ChromeVisLens.CROSS_IMG = 'url(data:image/png;base64,iVBORw0KGgoAAA' +
    'ANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkw' +
    'AAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sIFxEVKrh5hC4AAADDSURBVEjH7ZbRDc' +
    'MgDETvugErsAKzdIWswApdgVm6QlfIClnB/TGSG6UqoKB81CdZCCF4PoMlKCK4QjdcJAc72M' +
    'F/AiaZSQrJjWQkiV18rDeRReRnqJ4AREerCGDTtXvzmR3gYADZgGtCjy4zHWCoI9EEoiYgAF' +
    '6a2DQw1FmF1Qqk7usbAAcAqwL3ZW8Gn9FOcWhXp+OgJa5O1yPXM0pdX3DReTL3vMwCly99vJ' +
    'iXns4Gl6O2McoW3nIm/bPnYAc7eFRvJmkZLrREq8AAAAAASUVORK5CYII=)';

/**
 * Initializes the ChromeVis lens with settings pulled from background page.
 * @private
 */
chromevis.ChromeVisLens.prototype.initializeLens_ = function() {
  this.initializeLensCSS_();

  this.lens.style.display = 'none';
  chromevis.ChromeVisLens.ACTIVE_DOC.body.appendChild(this.lens);

  chromevis.ChromeVisLens.ACTIVE_DOC.addEventListener('scroll',
      function() {
        if (cvox.ChromeVox.lens) {
          cvox.ChromeVox.lens.updateAnchorLens();
        }
      }, true);

  this.updateAnchorLens();
};


/**
 * Respond to an event fired from the background page requesting the lens
 * to update.
 * @private
 */
chromevis.ChromeVisLens.prototype.handleBackgroundMessage = function(message) {
  switch (message.data) {
    case chromevis.ChromeVisLens.ANCHOR_ATTRB:
      self.setAnchoredLens(message.value);
      self.isAnchored ? self.updateAnchorLens() : self.updateBubbleLens();
      break;
    case chromevis.ChromeVisLens.CENTER_ATTRB:
      self.isCentered = message.value;
      if (!self.isAnchored) {
        self.updateBubbleLens();
      }
      break;
    case chromevis.ChromeVisLens.MULT_ATTRB:
      var multData = message.value;
      if (multData != null) {
        self.multiplier = parseFloat(multData);
        self.setMagnification();
        // Must update position of lens after text size has changed
        self.isAnchored ? self.updateAnchorLens() : self.updateBubbleLens();
      }
      break;
    case chromevis.ChromeVisLens.TXT_COLOR_ATTRB:
      var textColorData = message.value;
      if (textColorData != null) {
        self.textColor = textColorData;
        self.setTextColor();
      }
      break;
    case chromevis.ChromeVisLens.BG_COLOR_ATTRB:
      var bgColorData = message.value;
      if (bgColorData != null) {
        self.bgColor = bgColorData;
        self.setBgColor();
      }
      break;
  }
};


/**
 * Displays or hides the lens.
 * @param {boolean} show Whether or not the lens should be shown.
 */
chromevis.ChromeVisLens.prototype.showLens = function(show) {
  show ? this.lens.style.display = 'block' :
         this.lens.style.display = 'none';

  this.isLensDisplayed_ = show;

  this.isLensDisplayed_ ? this.updateText() : document.body.style.marginTop = 0;
};


/**
 * @return {boolean} True if the lens is currently shown.
 */
chromevis.ChromeVisLens.prototype.isLensDisplayed = function() {
  return this.isLensDisplayed_;
};


/**
 * Initializes the lens CSS.
 * @private
 */
chromevis.ChromeVisLens.prototype.initializeLensCSS_ = function() {
  this.lens.style.backgroundColor = this.bgColor;

  // Style settings
  this.lens.style.borderColor = '#000000';
  this.lens.style.borderWidth = 'medium';
  this.lens.style.borderStyle = 'groove';

  this.lens.style.position = 'absolute';

  // Note: there is no specified maximum value for the zIndex.
  // Occasionally there will be a website that has an element with a zIndex
  // higher than this one.  The only fix is to manually go here and increase
  // the zIndex.
  this.lens.style.zIndex = 100000000000;

  this.lens.style.minHeight = 5 + 'px';

  // 55 px is for the buttons
  this.lens.style.maxHeight = Math.round(window.innerHeight / 4) + 55 + 'px';

  this.lens.style.boxShadow = '1px 1px 2px #808080';

  // Class setting - this special class name means ChromeVis will
  // not try to select text content inside the lens.
  this.lens.className = cvox.TraverseUtil.SKIP_CLASS;
};


/**
 * Sets whether the lens is anchored to the top of the page or whether it floats
 * near the selected text.
 * @param {boolean} anchored Whether or not the lens is anchored.
 */
chromevis.ChromeVisLens.prototype.setAnchoredLens = function(anchored) {
  this.isAnchored = anchored;
  if ((this.isLensDisplayed_) && (!this.isAnchored)) {
    document.body.style.marginTop = 0;
  }
};


/**
 * Refreshes the position of the anchor lens on the page. This is usually done
 * in response to scrolling or a window resize.
 */
chromevis.ChromeVisLens.prototype.updateAnchorLens = function() {
  if (this.isAtBottom) {
    this.lens.style.top = '';
    this.lens.style.bottom = (5 - window.scrollY) + 'px';
  } else {
    this.lens.style.bottom = '';
    this.lens.style.top = window.scrollY + 'px';
  }
  this.lens.style.minWidth = (window.innerWidth - 50) + 'px';
  this.lens.style.maxWidth = (window.innerWidth - 50) + 'px';

  this.lens.style.left = 10 + 'px';
  this.lens.style.right = 100 + 'px';

  var bod = document.body;
  var str_ht = window.getComputedStyle(this.lens, null).height;
  // need to add 20 to the computed style to take into account the margin
  var ht = parseInt(str_ht.substr(0, str_ht.length - 2), 10) + 20;
  if (!this.isAtBottom) {
    // Push rest of document down underneath anchor lens.
    // Does not work  with documents that have absolutely positioned
    // elements - because absolutely positioned element margins
    // never collapse with global  margins.
    bod.style.marginTop = ht + 'px';
    bod.style.marginBottom = '0px';
  } else {
    bod.style.marginBottom = ht + 'px';
    bod.style.marginTop = '0px';
  }
};


/**
 * Refreshes the position of the bubble lens on the page.  This is done in
 * response to the selection changing or the window resizing.
 */
chromevis.ChromeVisLens.prototype.updateBubbleLens = function() {
  var sel = window.getSelection();
  var pos = cvox.SelectionUtil.findSelPosition(sel);

  var top;
  var left;
  if (pos == null) {
    top = 0;
    left = 0;
  }
  top = pos[0];
  left = pos[1];

  this.lens.style.minWidth = 0;

  // Calculate maximum lens width
  var parent;
  var maxw;
  if (this.isCentered) {
    // Want width with lens centered in the parent element
    // So maxwidth is width of parent
    parent = sel.getRangeAt(0).commonAncestorContainer;
    while (!parent.offsetWidth) {
      parent = parent.parentNode;
    }
    maxw = Math.min(this.maxBubbleWidth_, parent.offsetWidth);
  } else {
    // Align the left edge of the lens with the left edge of the selection
    // So find maxwidth with left edge aligned
    maxw = Math.min(this.maxBubbleWidth_,
                    ((document.body.clientWidth - left) - 16));
  }

  this.lens.style.maxWidth = maxw + 'px';
  // Now calculate lens left position
  // First check if actual width is larger than maxWidth
  if (this.lens.firstChild.scrollWidth > maxw) {
    var shiftLeft = this.lens.firstChild.scrollWidth - maxw;

    this.lens.style.maxWidth = this.lens.firstChild.scrollWidth + 'px';
    // A temporary fix to avoid setting left to a negative number.
    // TODO (rshearer): Find a better solution.
    if (shiftLeft < left) {
      this.lens.style.left = (left - shiftLeft) + 'px';
    } else {
      this.lens.style.left = '30px';
    }
  } else {
    if (this.isCentered) {
      // Center the lens in the parent element
      var pleft = 0;
      var obj = parent;

      if (obj.offsetParent) {
        pleft = obj.offsetLeft;
        obj = obj.offsetParent;
        while (obj !== null) {
          pleft += obj.offsetLeft;
          obj = obj.offsetParent;
        }
      }

      this.lens.style.left =
          Math.ceil((pleft + (parent.offsetWidth / 2)) -
                    (this.lens.firstChild.scrollWidth / 2)) +
              'px';
    } else {
      // Align the left edge of the lens with the left edge of the selection
      this.lens.style.left = left + 'px';
    }
  }
  this.lens.style.right = 'auto';

  // Calculate lens height and top position
  var str_ht = window.getComputedStyle(this.lens, null).height;
  var ht = parseInt(str_ht.substr(0, str_ht.length - 2), 10) + 20;

  var actualTop = top - ht;
  if (actualTop < 0) {
    this.lens.style.top = 5 + 'px';
  } else {
    this.lens.style.top = actualTop + 'px';
  }
};


/**
 * Set the lens to the given content, which should be an unparented
 * <div> html element containing the text to be displayed.
 * @param {Element} contentElem The element to display in the lens.
 */
chromevis.ChromeVisLens.prototype.setLensContent = function(contentElem) {
  if (!this.isLensDisplayed_) {
    return;
  }

  // Need to replace current lens node due to Webkit caching some
  // display settings between lens changes.
  chromevis.ChromeVisLens.ACTIVE_DOC = window.document;
  chromevis.ChromeVisLens.ACTIVE_DOC.body.removeChild(this.lens);
  this.lens = chromevis.ChromeVisLens.ACTIVE_DOC.createElement('span');

  this.initializeLensCSS_();

  chromevis.ChromeVisLens.ACTIVE_DOC.body.appendChild(this.lens);

  while (this.lens.firstChild) {
    this.lens.removeChild(this.lens.firstChild);
  }

  // Style settings
  contentElem.style.fontFamily = 'Verdana, Arial, Helvetica, sans-serif';
  contentElem.style.fontWeight = 'normal';
  contentElem.style.fontStyle = 'normal';
  contentElem.style.color = this.textColor;
  contentElem.style.textDecoration = 'none';
  contentElem.style.textAlign = 'left';
  contentElem.style.lineHeight = 1.25;
  contentElem.style.maxHeight = Math.round(window.innerHeight / 4) + 'px';
  contentElem.style.overflowY = 'scroll';

  this.lens.appendChild(contentElem);

  contentElem.scrollTop = contentElem.scrollHeight;

  var line = document.createElement('hr');
  this.lens.appendChild(line);

  // Button to set position of the lens.
  var button1 = document.createElement('button');
  button1.onclick = function() {
    cvox.ChromeVox.lens.changeLocation();
    (this.style.backgroundImage == chromevis.ChromeVisLens.DOWN_ARROW_IMG) ?
        this.style.backgroundImage = chromevis.ChromeVisLens.UP_ARROW_IMG :
        this.style.backgroundImage = chromevis.ChromeVisLens.DOWN_ARROW_IMG;
    this.style.backgroundColor = '#888';
   };
  if (this.isAtBottom) {
    button1.style.backgroundImage = chromevis.ChromeVisLens.UP_ARROW_IMG;
  } else {
    button1.style.backgroundImage = chromevis.ChromeVisLens.DOWN_ARROW_IMG;
  }
  cvox.ChromeVox.lens.setButtonStyle(button1);
  this.lens.appendChild(button1);

  // Button to increase font size.
  var button2 = document.createElement('button');
  button2.onclick = function() {
    cvox.ChromeVox.lens.increaseFontSize();
   };
  button2.style.backgroundImage = chromevis.ChromeVisLens.PLUS_IMG;
  cvox.ChromeVox.lens.setButtonStyle(button2);
  this.lens.appendChild(button2);

  // Button to increase font size.
  var button3 = document.createElement('button');
  button3.onclick = function() {
    cvox.ChromeVox.lens.decreaseFontSize();
   };
  button3.style.backgroundImage = chromevis.ChromeVisLens.MINUS_IMG;
  cvox.ChromeVox.lens.setButtonStyle(button3);
  this.lens.appendChild(button3);

  // Button to temporarily hide the lens (until next message appears).
  var button4 = document.createElement('button');
  button4.onclick = function() {
    this.parentNode.style.display = 'none';
    document.body.style.marginTop = '0px';
    document.body.style.marginBottom = '0px';
   };
  button4.style.backgroundImage = chromevis.ChromeVisLens.CROSS_IMG;
  cvox.ChromeVox.lens.setButtonStyle(button4);
  this.lens.appendChild(button4);

  this.magnifyText_();
  this.padText_();
  this.isAnchored ? this.updateAnchorLens() : this.updateBubbleLens();
};

/**
 * Set the style of the given button.
 *
 * @param {Element} button The button to be styled.
 */
chromevis.ChromeVisLens.prototype.setButtonStyle = function(button) {
  button.onmouseover = function() {this.style.backgroundColor = '#ccc';};
  button.onmouseout = function() {this.style.backgroundColor = '#888';};
  button.style.backgroundColor = '#888';
  button.style.backgroundPosition = 'center';
  button.style.border = '0px';
  button.style.width = '30px';
  button.style.height = '30px';
  button.style.cursor = 'pointer';
  button.style.marginRight = '5px';
};

/**
 * Decrease font size inside the lens.
 */
chromevis.ChromeVisLens.prototype.decreaseFontSize = function() {
  if (this.multiplier > 1) {
    this.multiplier = this.multiplier / 1.1;
  }
  this.magnifyText_();
  this.updateAnchorLens();
};

/**
 * Increase font size inside the lens.
 */
chromevis.ChromeVisLens.prototype.increaseFontSize = function() {
  if (this.multiplier < 5) {
    this.multiplier = this.multiplier * 1.1;
  }
  this.magnifyText_();
  this.updateAnchorLens();
};

/**
 * If the lens is at the top, move it to bottom, and vice versa.
 */
chromevis.ChromeVisLens.prototype.changeLocation = function() {
  cvox.ChromeVox.lens.isAtBottom = !cvox.ChromeVox.lens.isAtBottom;
  cvox.ChromeVox.lens.updateAnchorLens();
};

/**
 * Update the text displayed inside the lens.  This is done in response to the
 * selection changing.
 */
chromevis.ChromeVisLens.prototype.updateText = function() {
  if (!this.isLensDisplayed_) {
    return;
  }

  var sel = window.getSelection();
  var selectedText = sel.toString();

  if (selectedText == null) {
    // No selection, but still need to update the lens so it
    // has a consistent appearance
    selectedText = '';
  }

  var clonedNode = document.createElement('div');

  // To preserve new lines in selected text, need to create child div nodes
  // of the new element.
  // This also guards against selected text that includes HTML tags.
  var newSelectedText = '';
  var childNode = document.createElement('div');

  for (var i = 0; i < selectedText.length; i++) {
    if ((selectedText.charCodeAt(i) == 10)) {
      childNode.textContent = newSelectedText;
      clonedNode.appendChild(childNode);
      childNode = document.createElement('div');
      newSelectedText = '';
    } else {
      newSelectedText = newSelectedText + selectedText.charAt(i);
    }
  }
  childNode.textContent = newSelectedText;
  clonedNode.appendChild(childNode);

  this.setLensContent(clonedNode);
};


/**
 * Updates the lens in response to a window resize.
 */
chromevis.ChromeVisLens.prototype.updateResized = function() {
  this.isAnchored ? this.updateAnchorLens() : this.updateBubbleLens();
};


/**
 * Updates the lens in response to the document being scrolled;
 */
chromevis.ChromeVisLens.prototype.updateScrolled = function() {
  if (this.isAnchored) {
    this.updateAnchorLens();

    if (this.isLensDisplayed_) {
      // Force redraw to counteract scroll acceleration problem
      // Workaround: hide lens, check offsetHeight, display lens
      // this forces a redraw
      // TODO: file Chrome bug, get rid of this
      this.lens.style.display = 'none';
      var redrawFix = this.lens.offsetHeight;
      this.lens.style.display = 'block';
    }
  }
};


/**
 * Adjusts the text magnification.
 * @private
 */
chromevis.ChromeVisLens.prototype.magnifyText_ = function() {
  var adjustment = (this.multiplier * 100) + '%';

  if (this.lens.firstChild) {
    if (this.lens.firstChild.hasChildNodes()) {
      var children = this.lens.firstChild.childNodes;

      for (var i = 0; i < children.length; i++) {
        children[i].style.fontSize = adjustment;
      }
    }
  }
};


/**
 * Adjusts the padding around the text inside the lens.
 * @private
 */
chromevis.ChromeVisLens.prototype.padText_ = function() {
  if (this.padding_ < 0) {
    return;
  }
  this.lens.style.padding_ = this.padding_ + 'px';
};


/**
 * Sets the text magnification multiplier.
 */
chromevis.ChromeVisLens.prototype.setMagnification = function() {
  this.magnifyText_();
  this.padText_();
};


/**
 * Returns the current text size multiplier for magnification.
 * @return {number} The current text size multiplier.
 */
chromevis.ChromeVisLens.prototype.getMagnification = function() {
  return this.multiplier;
};


/**
 * Returns the current background color.
 * @return {string} The lens background color.
 */
chromevis.ChromeVisLens.prototype.getBgColor = function() {
  return this.bgColor;
};


/**
 * Updates the lens background color.
 */
chromevis.ChromeVisLens.prototype.setBgColor = function() {
  this.lens.style.backgroundColor = this.bgColor;
};


/**
 * Returns the current text color.
 * @return {string} The lens text color.
 */
chromevis.ChromeVisLens.prototype.getTextColor = function() {
  return this.textColor;
};


/**
 * Updates the lens text color.
 */
chromevis.ChromeVisLens.prototype.setTextColor = function() {
  if (this.lens.firstChild) {
    this.lens.firstChild.style.color = this.textColor;
  }
};
