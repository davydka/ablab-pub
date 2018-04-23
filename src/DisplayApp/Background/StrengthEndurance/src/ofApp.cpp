#include "ofApp.h"

int width = 1080;
int height = 1920;
int offset = 0;

int widgetCountX = 5;
int widgetCountY = 5;
vector<Widget> widgets;
Widget widget;

//--------------------------------------------------------------
void ofApp::setup() {
	ofSetVerticalSync(true);
	ofBackground(0, 0, 0);
	ofSetFrameRate(30);

	ofSetWindowTitle("Background");
	
	gui.setup();
	gui.add(guix.setup("x", -426, -1000, 1000, 600));
	gui.add(guiy.setup("y", -230, -1000, 1000, 600));
	gui.add(guir.setup("rotate", 45, 0, 360));

	
	for(int x = 0; x < widgetCountX; x++) {
		for(int y = 0; y < widgetCountY; y++) {
			if(x == 0 && y == 0
				|| x == 0 && y ==3
				|| x == 0 && y ==4
				|| x == 1 && y ==4
				|| x == 4 && y ==4
				|| x == 4 && y ==0
				|| x == 3 && y ==0
				|| x == 2 && y ==0
				|| x == 3 && y ==1
				|| x == 4 && y ==1
				|| x == 4 && y ==2
			) {
				continue;
			}

			Widget tempW = Widget();
			tempW.wallocate(ofVec2f(0 + (x*425), y*425));
			widgets.push_back(tempW);
		}
	}
}

//--------------------------------------------------------------
void ofApp::update() {
	offset++;
	if(offset > height*2) {
		offset = 0;
	}

	for(int i = 0; i < widgets.size(); i++) {
		widgets[i].update();
	}
	
}

//--------------------------------------------------------------
void ofApp::draw() {
	ofEnableAlphaBlending();
	ofClear(0);

	ofMesh temp;
	temp.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);

	temp.addVertex( ofPoint(0,0) );
	temp.addColor(ofColor::fromHex(0x3fbfad));
	temp.addVertex( ofPoint(width,0) );
	temp.addColor(ofColor::fromHex(0x3fbfad));

	temp.addVertex( ofPoint(0,height) );
	temp.addColor(ofColor::fromHex(0x0d51a3));
	temp.addVertex( ofPoint(width,height) );
	temp.addColor(ofColor::fromHex(0x0d51a3));

	temp.draw();

	ofPushMatrix();
	ofTranslate(width/2, height/2);
	ofRotateZ(guir);
	ofTranslate(-(width/2), -(height/2));
	ofTranslate(guix, guiy);
	for(int i = 0; i < widgets.size(); i++) {
		widgets[i].draw();
	}

	ofPopMatrix();

	// ofDrawBitmapString(ofToString(ofGetFrameRate()), 980, 40);
	// gui.draw();
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}

