// Copyright 2012 Google Inc.
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
 * @fileoverview Bridge that sends TTS messages from content scripts or
 * other pages to the main background page.
 *
 * @author dmazzoni@google.com (Dominic Mazzoni)
 */

goog.provide('cvox.ChromeTts');

goog.require('cvox.AbstractTts');
goog.require('cvox.HostFactory');

/**
 * @constructor
 * @extends {cvox.AbstractTts}
 */
cvox.ChromeTts = function() {
  cvox.AbstractTts.call(this);

  this.addBridgeListener();
};
goog.inherits(cvox.ChromeTts, cvox.AbstractTts);

/**
 * Current call id, used for matching callback functions.
 * @type {number}
 */
cvox.ChromeTts.callId = 1;

/**
 * Maps call ids to callback functions.
 * @type {Object.<number, Function>}
 */
cvox.ChromeTts.functionMap = new Object();

/** @override */
cvox.ChromeTts.prototype.speak = function(textString, queueMode, properties) {
  if (!properties) {
    properties = {};
  }

  properties['lang'] = cvox.ChromeVox.msgs.getLocale();

  // TODO (clchen, dmazzoni): Remove this once the TTS is able to fall back
  // gracefully if 'fr' is specified instead of 'fr-FR'.
  switch(properties['lang']) {
    case 'de':
      properties['lang'] = 'de-DE';
      break;
    case 'es':
      properties['lang'] = 'es-ES';
      break;
    case 'fr':
      properties['lang'] = 'fr-FR';
      break;
    case 'it':
      properties['lang'] = 'it-IT';
      break;
    case 'en':
      properties['lang'] = 'en-US';
      break;
  }

  goog.base(this, 'speak', textString, queueMode, properties);

  cvox.ExtensionBridge.send(
      this.createMessageForProperties_(textString, queueMode, properties));
};

/** @override */
cvox.ChromeTts.prototype.isSpeaking = function() {
  cvox.ChromeTts.superClass_.isSpeaking.call(this);
  return false;
};

/** @override */
cvox.ChromeTts.prototype.stop = function() {
  cvox.ChromeTts.superClass_.stop.call(this);
  cvox.ExtensionBridge.send(
      {'target': 'TTS',
       'action': 'stop'});
};

/** @override */
cvox.ChromeTts.prototype.increaseOrDecreaseProperty =
    function(propertyName, increase) {
  cvox.ExtensionBridge.send(
      {'target': 'TTS',
       'action': 'increaseOrDecrease',
       'property': propertyName,
       'increase': increase});
};

/**
 * Increases a TTS speech property.
 * @param {string} property_name The name of the property to increase.
 * @param {boolean} announce Whether to announce that the property is
 * changing.
 */
cvox.ChromeTts.prototype.increaseProperty = function(property_name, announce) {
  goog.base(this, 'increaseProperty', property_name, announce);
  cvox.ExtensionBridge.send(
      {'target': 'TTS',
       'action': 'increase' + property_name,
       'announce': announce});
};

/**
 * Listens for TTS_COMPLETED message and executes the callback function.
 */
cvox.ChromeTts.prototype.addBridgeListener = function() {
  cvox.ExtensionBridge.addMessageListener(
      function(msg, port) {
        var message = msg['message'];
        if (message == 'TTS_CALLBACK') {
          var id = msg['id'];
          var func = cvox.ChromeTts.functionMap[id];
          if (func != undefined) {
            func();
            delete cvox.ChromeTts.functionMap[id];
          }
        }
      });
};

/**
 * Creates a message suitable for sending as a speak action to background tts.
 * @param {string} textString The string of text to be spoken.
 * @param {number=} queueMode The queue mode: cvox.AbstractTts.QUEUE_MODE_FLUSH,
 *        for flush, cvox.AbstractTts.QUEUE_MODE_QUEUE for adding to queue.
 * @param {Object=} properties Speech properties to use for this utterance.
 * @return {Object} A message.
 * @private
 */
cvox.ChromeTts.prototype.createMessageForProperties_ =
    function(textString, queueMode, properties) {
  var message = {'target': 'TTS',
                 'action': 'speak',
                 'text': textString,
                 'queueMode': queueMode,
                 'properties': properties};

  if (properties['startCallback'] != undefined) {
    cvox.ChromeTts.functionMap[cvox.ChromeTts.callId] =
        properties['startCallback'];
    message['startCallbackId'] = cvox.ChromeTts.callId++;
  }
  if (properties['endCallback'] != undefined) {
    cvox.ChromeTts.functionMap[cvox.ChromeTts.callId] =
        properties['endCallback'];
    message['endCallbackId'] = cvox.ChromeTts.callId++;
  }
  return message;
    };

cvox.HostFactory.ttsConstructor = cvox.ChromeTts;
