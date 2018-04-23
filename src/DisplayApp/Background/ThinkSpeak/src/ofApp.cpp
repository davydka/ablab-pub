#include "ofApp.h"

int width = 1080;
int height = 1920;
int offset = 0;

//--------------------------------------------------------------
void ofApp::setup() {
	ofSetVerticalSync(true);
	ofBackground(0, 0, 0);
	ofSetFrameRate(60);

	ofSetWindowTitle("Background");

}

//--------------------------------------------------------------
void ofApp::update() {
	offset++;
	if(offset > height*2) {
		offset = 0;
	}
}

//--------------------------------------------------------------
void ofApp::draw() {
	ofEnableAlphaBlending();

	ofMesh temp;
	temp.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);

	temp.addVertex( ofPoint(0,0-offset) );
	temp.addColor(ofColor::fromHex(0xceb2d4));
	temp.addVertex( ofPoint(width,0-offset) );
	temp.addColor(ofColor::fromHex(0xceb2d4));

	temp.addVertex( ofPoint(0,height-offset) );
	temp.addColor(ofColor::fromHex(0x7ea4d9));
	temp.addVertex( ofPoint(width,height-offset) );
	temp.addColor(ofColor::fromHex(0x7ea4d9));

	temp.addVertex( ofPoint(0,(height*2)-offset) );
	temp.addColor(ofColor::fromHex(0xceb2d4));
	temp.addVertex( ofPoint(width,(height*2)-offset) );
	temp.addColor(ofColor::fromHex(0xceb2d4));

	temp.addVertex( ofPoint(0,(height*3)-offset) );
	temp.addColor(ofColor::fromHex(0x7ea4d9));
	temp.addVertex( ofPoint(width,(height*3)-offset) );
	temp.addColor(ofColor::fromHex(0x7ea4d9));

	temp.draw();

	// ofDrawBitmapString(ofToString(ofGetFrameRate()), 40, 40);
	// ofDrawBitmapString(ofToString((height*2)-offset), 40, 60);
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}

