#pragma once

#include "ofMain.h"
#include "ofxGui.h"

class ofApp : public ofBaseApp
{
	public:
		void setup();
		void update();
		void draw();
		void exit();
		void keyPressed(int key);

		void setUpNoise();
		void setUpNoiseA();
		void setUpNoiseB();
		float perlin(float x, float y, float z, vector<vector<int>> grad3, vector<int> aPerm);
		float dot(vector<int> g, float x, float y, float z);
		float fade(float t);
		float mix(float a, float b, float t);

		vector<string> arguments;

		ofxPanel gui;
		ofxIntSlider guix;
};
