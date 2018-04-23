#include "ofApp.h"

int max_lines = 30;
int start_y = 480;
int width = 1080;
int owidth = 1080 * 4;
int height = 1920;

float pIndex = 0;
vector <int> noise;
vector <int> noisea;
vector <int> noiseb;
float ms = 0;
int startx = 0;

float variation = .0015;

vector<vector<int>> grad3;
vector<int> perm;

vector<vector<int>> aGrad3;
vector<int> aPerm;

vector<vector<int>> bGrad3;
vector<int> bPerm;

//--------------------------------------------------------------
void ofApp::setup() {
	ofSetVerticalSync(true);
	ofBackground(0, 0, 0);
	ofSetFrameRate(60);
	ofSetWindowTitle("Background");

	for (int i = 0; i<arguments.size(); ++i) {
		if(arguments.at(i) == "2") {
			startx = 1080;
		}
		if(arguments.at(i) == "3") {
			startx = 2160;
		}
		if(arguments.at(i) == "4") {
			startx = 3240;
		}
	}

	gui.setup("params", "params", 400, 20);
	gui.setSize(600, 40);
	gui.add(guix.setup("x", startx, 0, owidth-width, 600));
	// guix.setup("x", 1, 0, owidth-width, 600);

	ofBuffer buffera = ofBufferFromFile("noisea.txt");
	if (buffera.size()) {
		for (ofBuffer::Line it = buffera.getLines().begin(), end = buffera.getLines().end(); it != end; ++it) {
			string line = *it;
			if (line.empty() == false) {
				noisea.push_back(ofToInt(line));
			}
			// cout << line << endl;
		}
	}

	ofBuffer bufferb = ofBufferFromFile("noiseb.txt");
	if (bufferb.size()) {
		for (ofBuffer::Line it = bufferb.getLines().begin(), end = bufferb.getLines().end(); it != end; ++it) {
			string line = *it;
			if (line.empty() == false) {
				noiseb.push_back(ofToInt(line));
			}
			// cout << line << endl;
		}
	}

	setUpNoise();
	setUpNoiseA();
	aGrad3 = grad3;
	aPerm = perm;

	grad3.clear();
	perm.clear();

	setUpNoiseB();
	bGrad3 = grad3;
	bPerm = perm;
}

//--------------------------------------------------------------
void ofApp::update() {
	// ofSetWindowShape(width,height);
	float h = ofToFloat(ofGetTimestampString("%H")) * 60 * 60;
	float m = ofToFloat(ofGetTimestampString("%M")) * 60;
	float s = ofToFloat(ofGetTimestampString("%S"));
	float time = h + m + s;
	ms = (time * 1000) + ofToFloat(ofGetTimestampString("%i"));
	pIndex = time;

	// cout << ofToString(time) << endl;
}

//--------------------------------------------------------------
void ofApp::draw() {
	ofEnableAlphaBlending();

	ofMesh temp;
	temp.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);
	temp.addVertex( ofPoint(0,0) );
	temp.addColor(ofColor::fromHex(0xf06b22));
	temp.addVertex( ofPoint(width,0) );
	temp.addColor(ofColor::fromHex(0xf06b22));
	temp.addVertex( ofPoint(0,height) );
	temp.addColor(ofColor::fromHex(0xea202d));
	temp.addVertex( ofPoint(width,height) );
	temp.addColor(ofColor::fromHex(0xea202d));
	temp.draw();
	
	ofNoFill();
	ofPushMatrix();
	ofTranslate(-(guix), 0, 0);
	for (int i = 0; i < max_lines; i++) {
		ofBeginShape();
		float variator = (i * .04) + (ms * .000096);
		float px = 0, py = 0;
		for(int x=-30; x<=owidth+30; x+= 30) {
			px = x;
			py = perlin(pIndex*variation+variator, px*variation, 0, aGrad3, aPerm);
			py = start_y + 480 * py;
			ofCurveVertex(px, py);
		}
		ofSetColor(255,255,255, 125-(i*10));

		ofEndShape(false);
	}

	for (int i = 0; i < max_lines; i++) {
		ofBeginShape();
		float variator = (i * .04) + (ms * .000096);
		float px = 0, py = 0;
		for(int x=-30; x<=owidth+30; x+= 30) {
			px = x;
			py = perlin(pIndex*variation+variator, px*variation, 0, aGrad3, bPerm);
			py = start_y + 480 * py;
			ofCurveVertex(px, py+960);
		}
		ofSetColor(255,255,255, 125-(i*10));

		ofEndShape(false);
	}
	ofPopMatrix();

	ofSetHexColor(0xFFFFFF);
	// ofDrawBitmapString(ofToString(ofGetFrameRate()), 40, 40);
	// gui.draw();
}

//--------------------------------------------------------------
void ofApp::exit() {
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}

float ofApp::dot(vector<int> g, float x, float y, float z) {
	return g[0]*x + g[1]*y + g[2]*z;
}

float ofApp::fade(float t) {
	return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float ofApp::mix(float a, float b, float t) {
	return (1.0-t)*a + t*b;
}

void ofApp::setUpNoise(){
	grad3.resize(12);
	vector<int> tempVect;
	tempVect.resize(3);

	tempVect[0] = 1;
	tempVect[1] = 1;
	tempVect[2] = 0;
	grad3[0] = tempVect;

	tempVect[0] = -1;
	tempVect[1] = 1;
	tempVect[2] = 0;
	grad3[1] = tempVect;

	tempVect[0] = 1;
	tempVect[1] = -1;
	tempVect[2] = 0;
	grad3[2] = tempVect;

	tempVect[0] = -1;
	tempVect[1] = -1;
	tempVect[2] = 0;
	grad3[3] = tempVect;

	tempVect[0] = 1;
	tempVect[1] = 0;
	tempVect[2] = 1;
	grad3[4] = tempVect;

	tempVect[0] = -1;
	tempVect[1] = 0;
	tempVect[2] = 1;
	grad3[5] = tempVect;

	tempVect[0] = 1;
	tempVect[1] = 0;
	tempVect[2] = -1;
	grad3[6] = tempVect;

	tempVect[0] = -1;
	tempVect[1] = 0;
	tempVect[2] = -1;
	grad3[7] = tempVect;

	tempVect[0] = 0;
	tempVect[1] = 1;
	tempVect[2] = 1;
	grad3[8] = tempVect;

	tempVect[0] = 0;
	tempVect[1] = -1;
	tempVect[2] = 1;
	grad3[9] = tempVect;

	tempVect[0] = 0;
	tempVect[1] = 1;
	tempVect[2] = -1;
	grad3[10] = tempVect;

	tempVect[0] = 0;
	tempVect[1] = -1;
	tempVect[2] = -1;
	grad3[11] = tempVect;

/*
	vector<int> p;
	for(int i = 0; i<256; i++) {
		int tempI = (int)ofRandom(1, 256);
		p.push_back( tempI );
		// cout << tempI << endl;
		// p.push_back( (int)ofRandom(1, 256) );
	}

	for(int i = 0; i<512; i++) {
		perm.push_back( noisea[i & 255] );
		// perm.push_back( p[i & 255] );
	}
*/

/*
	[1,1,0],
	[-1,1,0],
	[1,-1,0],
	[-1,-1,0],
	[1,0,1],
	[-1,0,1],
	[1,0,-1],
	[-1,0,-1],
	[0,1,1],
	[0,-1,1],
	[0,1,-1],
	[0,-1,-1]
*/
}

void ofApp::setUpNoiseA(){
	for(int i = 0; i<512; i++) {
		perm.push_back( noisea[i & 255] );
		// perm.push_back( p[i & 255] );
	}
}

void ofApp::setUpNoiseB(){
	for(int i = 0; i<512; i++) {
		perm.push_back( noiseb[i & 255] );
		// perm.push_back( p[i & 255] );
	}
}

float ofApp::perlin(float x, float y, float z, vector<vector<int>> tGrad3, vector<int> tPerm){
	int X = floor(x);
	int Y = floor(y);
	int Z = floor(z);

	float rX = x - X;
	float rY = y - Y;
	float rZ = z - Z;

	X = X & 255;
	Y = Y & 255;
	Z = Z & 255;

	int gi000 = tPerm[ X + tPerm[ Y + tPerm[ Z ] ] ] % 12;
	int gi001 = tPerm[ X + tPerm[ Y + tPerm[ Z + 1 ] ] ] % 12;
	int gi010 = tPerm[ X + tPerm[ Y + 1 + tPerm[ Z ] ] ] % 12;
	int gi011 = tPerm[ X + tPerm[ Y + 1 + tPerm[ Z + 1 ] ] ] % 12;
	int gi100 = tPerm[ X + 1 + tPerm[ Y + tPerm[ Z ] ] ] % 12;
	int gi101 = tPerm[ X + 1 + tPerm[ Y + tPerm[ Z + 1 ] ] ] % 12;
	int gi110 = tPerm[ X + 1 + tPerm[ Y + 1 + tPerm[ Z ] ] ] % 12;
	int gi111 = tPerm[ X + 1 + tPerm[ Y + 1 + tPerm[ Z + 1 ] ] ] % 12;

	float n000 = dot(tGrad3[gi000], rX, rY, rZ);
	float n100 = dot(tGrad3[gi100], rX-1, rY, rZ);
	float n010 = dot(tGrad3[gi010], rX, rY-1, rZ);
	float n110 = dot(tGrad3[gi110], rX-1, rY-1, rZ);
	float n001 = dot(tGrad3[gi001], rX, rY, rZ-1);
	float n101 = dot(tGrad3[gi101], rX-1, rY, rZ-1);
	float n011 = dot(tGrad3[gi011], rX, rY-1, rZ-1);
	float n111 = dot(tGrad3[gi111], rX-1, rY-1, rZ-1);

	float u = fade(rX);
	float v = fade(rY);
	float w = fade(rZ);

	float nx00 = mix(n000, n100, u);
	float nx01 = mix(n001, n101, u);
	float nx10 = mix(n010, n110, u);
	float nx11 = mix(n011, n111, u);

	float nxy0 = mix(nx00, nx10, v);
	float nxy1 = mix(nx01, nx11, v);

	float nxyz = mix(nxy0, nxy1, w);

	// cout << nxyz << endl;

	return nxyz;
}
