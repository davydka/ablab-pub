#include "ofApp.h"

int width = 1080;
int height = 1920;
int frame = 0;
int framesTotal = 0;
int positionOffset = 0;

//--------------------------------------------------------------
void ofApp::setup() {
	ofSetVerticalSync(true);
	ofBackground(0, 0, 0);
	ofSetFrameRate(24);

	ofSetWindowTitle("Background");

	videoPlayer.load("pediatrics.mp4");
	videoPlayer.setLoopState(OF_LOOP_NORMAL);
	videoPlayer.play();
	framesTotal = videoPlayer.getTotalNumFrames();
	cout << videoPlayer.getTotalNumFrames() << endl;

	for (int i=0; i<arguments.size(); ++i) {
		if(arguments.at(i) == "2") {
			positionOffset = -1080;
		}
	}
}

//--------------------------------------------------------------
void ofApp::update() {
	videoPlayer.update();
}

//--------------------------------------------------------------
void ofApp::draw() {
	// ofEnableAlphaBlending();

	if(videoPlayer.isLoaded()) {
		videoPlayer.draw(positionOffset, 0, 2160, 1920);
	} else {
		ofMesh temp;
		temp.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);

		temp.addVertex( ofPoint(0,0) );
		temp.addColor(ofColor::fromHex(0xb1d248));
		temp.addVertex( ofPoint(width,0) );
		temp.addColor(ofColor::fromHex(0xb1d248));

		temp.addVertex( ofPoint(0,height) );
		temp.addColor(ofColor::fromHex(0x73be4d));
		temp.addVertex( ofPoint(width,height) );
		temp.addColor(ofColor::fromHex(0x73be4d));

		temp.draw();
	}

	// ofDrawBitmapString(ofToString(ofGetFrameRate()), 40, 40);
	// ofDrawBitmapString(ofToString((height*2)-offset), 40, 60);
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}

