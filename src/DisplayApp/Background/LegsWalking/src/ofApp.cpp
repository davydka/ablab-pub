#include "ofApp.h"

int width = 1080;
int height = 1920;
int offset = 0;
int circleCount = 8;

vector<Circle> circles;

//--------------------------------------------------------------
void ofApp::setup() {
	ofSetVerticalSync(true);
	ofBackground(0, 0, 0);
	ofSetFrameRate(60);

	ofSetWindowTitle("Background");

    ofSetCircleResolution(100);
	for(int i = 0; i < circleCount; i++) {
		Circle tempCircle = Circle(ofVec3f(150*i+ofRandom(0, 10), ofRandom(0, height), ofRandom(12,24)*2));
		circles.push_back(tempCircle);
	}
}

//--------------------------------------------------------------
void ofApp::update() {
	offset++;
	if(offset > height*2) {
		offset = 0;
	}

	for(int i = 0; i < circles.size(); i++) {
		circles[i].update();
	}
}

//--------------------------------------------------------------
void ofApp::draw() {
	ofEnableAlphaBlending();

	ofMesh temp;
	temp.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);

	temp.addVertex( ofPoint(0,0) );
	temp.addColor(ofColor::fromHex(0xfbab18));
	temp.addVertex( ofPoint(width,0) );
	temp.addColor(ofColor::fromHex(0xfbab18));

	temp.addVertex( ofPoint(0,height) );
	temp.addColor(ofColor::fromHex(0xff6b00));
	temp.addVertex( ofPoint(width,height) );
	temp.addColor(ofColor::fromHex(0xff6b00));

	temp.draw();

	for(int i = 0; i < circles.size(); i++) {
		circles[i].draw();
	}

	ofSetHexColor(0xffffff);
	// ofDrawBitmapString(ofToString(ofGetFrameRate()), 40, 40);
	// ofDrawBitmapString(ofToString((height*2)-offset), 40, 60);
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}

