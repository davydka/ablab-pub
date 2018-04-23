#include "ofApp.h"

int width = 1080;
int height = 1920;

int shellsCount = 12;
vector<Shell> shells;

int timer;
int startTime;
Splash splash;

//--------------------------------------------------------------
void ofApp::setup() {
	ofSetVerticalSync(true);
	ofBackground(0, 0, 0);
	ofSetFrameRate(60);

	ofSetWindowTitle("Background");
	ofSetCircleResolution(100);

	for(int i = 0; i < shellsCount; i++) {
		ofSeedRandom();
		Shell shell = Shell(ofVec3f(90*i+ofRandom(0,100), ofRandom(0, height), ofRandom(0.08, 0.5)));
		shells.push_back(shell);
	}

	startTime = ofGetElapsedTimeMillis();
	splash = Splash();
	splash.setPos(ofVec2f(ofRandom(100, 980), ofRandom(100, 1820)));
}

//--------------------------------------------------------------
void ofApp::update() {
	for(int i = 0; i< shellsCount; i++) {
		shells[i].update();
	}

	timer = ofGetElapsedTimeMillis() - startTime;
	if(timer >= 18*1000) { // every 18 seconds
		startTime = ofGetElapsedTimeMillis();
		splash.setPos(ofVec2f(ofRandom(100, 980), ofRandom(100, 1820)));
	}
	splash.update();
}

//--------------------------------------------------------------
void ofApp::draw() {
	ofEnableAlphaBlending();

	ofMesh temp;
	temp.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);
	temp.addVertex( ofPoint(0,0) );
	temp.addColor(ofColor::fromHex(0x75cee0));
	temp.addVertex( ofPoint(width,0) );
	temp.addColor(ofColor::fromHex(0x75cee0));
	temp.addVertex( ofPoint(0,height) );
	temp.addColor(ofColor::fromHex(0x33afa3));
	temp.addVertex( ofPoint(width,height) );
	temp.addColor(ofColor::fromHex(0x33afa3));
	temp.draw();

	ofSetHexColor(0xFFFFFF);
	// ofDrawBitmapString(ofToString(ofGetFrameRate()), 40, 40);

	//9de4d6
	splash.draw();

	for(int i = 0; i< shellsCount; i++) {
		shells[i].draw();
	}
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}
