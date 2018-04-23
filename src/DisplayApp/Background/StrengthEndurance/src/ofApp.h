#pragma once

#include "ofMain.h"
#include "ofxGui.h"

class Widget {
	public:
		Widget() {
			timer = 0;
			alpha = 200;
			theta1 = 0.180 + ofRandom(-0.01, 0.01);
			theta2 = 0.120 + ofRandom(-0.02, 0.02);
			theta3 = 0.035 + ofRandom(-0.01, 0.01);
			color1 = ofColor(124, 193, 76);
			color2 = ofColor(63, 191, 173);
			color3 = ofColor(0, 144, 218);

			length = 80;
			width = 26;
			cr = 13;
			xThing = (length*2) + (width+cr);
			yThing = (length*2) + (width+cr);
			allo = false;

			darc1 = ofRandom(0, 360);
			// dtheta1 = 0.05;
			dtheta1 = 0.1 + ofRandom(-0.01, 0.01);
		}

		// fbo has to explicitly be allocated in ofApp.cpp -> setup() area for some reason
		void wallocate(ofVec2f initPos) {
			pos.set( initPos );

			tmpImage.grabScreen(pos.x+1, pos.y+1, 1, 1);
			colorHolder.set(tmpImage.getColor(0,0));

			int tmpVal = (length * 4) + (width * 4);
			wFbo.allocate(tmpVal, tmpVal, GL_RGBA, 4);

			wFbo.begin();
			ofClear(255, 0);
			wFbo.end();
			allo = true;
		}

		void update() {
			timer++;

			// make sure screen has been drawn before grabbing values
			if(timer < 25) {
				// cout << pos.y << endl;
				tmpImage.grabScreen(1, pos.y+1, 1, 1);
				colorHolder.set(tmpImage.getColor(0,0));
			}

			arc1 += theta1;
			if(arc1 > 360) {
				arc1 = 0;
			}

			arc2 += theta2;
			if(arc2 > 360) {
				arc2 = 0;
			}

			arc3 += theta3;
			if(arc3 > 360) {
				arc3 = 0;
			}

			darc1 += dtheta1;
			if(darc1 > 360) {
				darc1 = 0;
			}
		}

		void draw() {
			// ofSetRectMode(OF_RECTMODE_CENTER);
			if(!allo) {
				return;
			}
			ofEnableSmoothing();
			float xVal = wFbo.getWidth()/2;
			float yVal = wFbo.getHeight()/2;

			wFbo.begin();
				ofClear(colorHolder.r, colorHolder.g, colorHolder.b, 0);

				ofSetColor(color2, alpha);
				ofPushMatrix();
				ofTranslate(xThing + cr, yThing + cr);
				ofRotateZ(arc2);
				ofTranslate(-(xThing + cr), -(yThing + cr));
				ofDrawRectRounded(xThing, yThing, length+width, width, cr);
				ofPopMatrix();

				ofSetColor(color1, alpha);
				ofPushMatrix();
				x1 = length * cos(ofDegToRad(arc2)) + xThing;
				y1 = length * sin(ofDegToRad(arc2)) + yThing;
				ofTranslate(x1 + (width/2), y1 + (width/2));
				ofRotateZ(arc1);
				ofTranslate(-(x1 + (width/2)), -(y1 + (width/2)));
				ofDrawRectRounded(x1, y1, length+width, width, cr);
				ofPopMatrix();

				ofSetColor(color3, alpha);
				ofDrawRectRounded(xThing, yThing, length+width, width, cr);

				// ofSetColor(255,0,0);
				// ofDrawLine(xVal, 0, xVal, yVal*2);
				// ofDrawLine(0, yVal, xVal*2, yVal);
			wFbo.end();

			ofSetColor(255,255);

			ofPushMatrix();
			ofTranslate(pos.x+xVal, pos.y+yVal);
			ofRotateZ(darc1);
			ofTranslate(-(pos.x+xVal), -(pos.y+yVal));
 			wFbo.draw(pos.x, pos.y, xVal*2, yVal*2);
			ofPopMatrix();
		}

		ofVec2f pos;
		ofColor colorHolder;
		ofImage tmpImage;
		int timer;
		int alpha;
		float x1;
		float y1;

		ofFbo wFbo;
		bool allo;
		float xThing;
		float yThing;
		float length;
		float width;
		float cr; // corner radius

		float theta1;
		float arc1;
		float theta2;
		float arc2;
		float theta3;
		float arc3;
		ofColor color1;
		ofColor color2;
		ofColor color3;

		float darc1;
		float dtheta1;
};

class ofApp : public ofBaseApp
{
	public:
		void setup();
		void update();
		void draw();
		void exit();
		void keyPressed(int key);

		ofxPanel gui;
		ofxIntSlider guix;
		ofxIntSlider guiy;
		ofxIntSlider guir;
};
