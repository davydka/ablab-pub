#pragma once

#include "ofMain.h"
#include "ofxSvg.h"

class Shell {
	public:
		Shell(ofVec3f initPos) {
			pos.set(initPos);
			scale = pos.z;
			svg.load("shape.svg");

			ofSeedRandom();
			rot = ofRandom(4, 90);
			offset = 0;
			rate = 0.1;
			ofSeedRandom();
			vel = ofRandom(0.05, 0.3);
			rate = rate+vel;
			rotrate = ofRandom(-.25, 0.25);
		}

		void reset() {
			offset = 0;
			pos.y = -200;
			vel = ofRandom(0.05, 0.3);
			ofSeedRandom();
			scale = ofRandom(0.08, 0.5);
			ofSeedRandom();
			rotrate = ofRandom(-.25, 0.25);
		}

		void update() {
			rot+=rotrate;
			offset+=rate;
			if(pos.y+offset > 1920 + 200) {
				reset();
			}
		}

		void draw() {
			ofPushMatrix();
			ofTranslate(pos.x, pos.y+offset);
			ofRotateZ(rot);
			ofScale(scale, scale);
			svg.draw();
			ofPopMatrix();
		}

		ofVec3f pos;
		float rate;
		float vel;
		float offset;
		float scale;
		float rot;
		float rotrate;

		ofxSVG svg;
};

class Splash {
	public:
		Splash() {
			timer = 20000; //something past the draw threshold
			splashtime = 720 + ofRandom(0, 120); // 12 seconds at 60 fps is 12*60
			alphaoffset = (splashtime/2) / 20;
			diameter = 100 + ofRandom(0, 20);
			pos.set(0,0);
		}

		void setPos(ofVec2f initPos) {
			timer = 0;
			splashtime = 720 + ofRandom(0, 120);
			alphaoffset = (splashtime/2) / 20;
			diameter = 100 + ofRandom(0, 20);
			pos.set(initPos);
		}

		void update() {
			timer++;
		}

		void draw() {
			ofNoFill();

			for(int i = 0; i < 20; i++){
				alpha = ofMap(timer, 540+i*alphaoffset, splashtime+i*alphaoffset, 255, 0, true);
				// 0x9de4d6
				ofSetColor(157, 228, 213, alpha);
				ofDrawCircle(
					pos.x,
					pos.y,
					ofMap(
						timer*1.5,
						0+i*100,
						splashtime*1.5+i*100,
						0,
						diameter,
						true
					)
				);
			}
		}

		int timer;
		int splashtime;
		int alpha;
		int alphaoffset;
		int diameter;
		ofVec2f pos;
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
