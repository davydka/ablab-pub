#pragma once

#include "ofMain.h"

class Circle {
	public:
		Circle(ofVec3f initPos) {
			offset = 0;

			alpha = 255;
			colors.resize(4);
			colors[0].set(232,140,59, alpha);
			colors[1].set(242,186,106, alpha);
			colors[2].set(241,178,65, alpha);
			colors[3].set(233,116,49, alpha);
			colors[4].set(221,121,48, alpha);
			colorHolder.set(colors[ofRandom(0,4)]);


			pos.set( initPos );
			// if farther thn halfway down screen,
			// have it animate upwards
			moveUp = initPos.y > 960;

			height = ofRandom(360, 960);
			if(!moveUp){
				height = -height;
			}
			lineSpacing = (initPos.z*2) / 5;
			rate = 0.1;
			vel = ofRandom(0.05, 0.3);
			rate = rate+vel;
		}

		void reset() {
			offset = 0;
			colorHolder.set(colors[ofRandom(0,4)]);

			moveUp = ofRandom(1, 100) > 50;
			height = ofRandom(360, 960);
			if(!moveUp){
				height = -height;
			}

			pos.y = moveUp ? 1920 : 0;
			pos.z = ofRandom(12,24)*2;
			lineSpacing = (pos.z*2) / 5;
		}

		void update() {
			if(moveUp) {
				offset-=rate;
				if(pos.y+offset < 0-height) {
					reset();
				}
			} else {
				offset+=rate;
				if(pos.y+offset > 1920+abs(height)) {
					reset();
				}
			}

			int y = pos.y+offset;
			int tmpY = y+height+2;
			if(tmpY < 0)
				tmpY = 0;
			if(tmpY > 1910)
				tmpY = 1910;
			tmpImage.grabScreen(pos.x, tmpY, 1, 1);
			tmpColor.set(tmpImage.getColor(0,0));
		}

		void draw() {
			drawLines();

			ofSetColor(colorHolder);
			ofDrawCircle(pos.x,pos.y+offset,pos.z);

			// ofSetColor(0,255,0);
			// ofDrawBitmapString(ofToString(pos.y+offset), pos.x, -40 + pos.y+offset);
			// ofDrawBitmapString(ofToString(height), pos.x, pos.y+offset);
		}

		void drawLines() {
			int y = pos.y+offset;
			
			for(int i = 0; i < 6; i++) {
				int x = pos.x+(-pos.z)+(i*lineSpacing);
				if(i == 0)
					x = x+1;
				if(i > 1 && i != 5)
					x = x-1;
				if(i == 5)
					x = x-2;

				ofMesh temp;
				temp.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);
				temp.addVertex( ofPoint(x,y) );
				temp.addColor(colorHolder);
				temp.addVertex( ofPoint(x+2,y) );
				temp.addColor(colorHolder);
				temp.addVertex( ofPoint(x, y + height) );
				temp.addColor(tmpColor);
				temp.addVertex( ofPoint(x+2, y + height) );
				temp.addColor(tmpColor);
				temp.draw();
			}
			
		}

		ofVec3f pos;
		vector<ofColor> colors;
		ofColor colorHolder;
		bool moveUp;
		float offset;
		int height;
		float lineSpacing;
		float rate;
		float vel;
		int alpha;

		ofImage tmpImage;
		ofColor tmpColor;
};

class ofApp : public ofBaseApp
{
	public:
		void setup();
		void update();
		void draw();
		void exit();
		void keyPressed(int key);
};
