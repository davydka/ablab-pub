#pragma once

#include "ofMain.h"

class ofApp : public ofBaseApp
{
	public:
		void setup();
		void update();
		void draw();
		void exit();
		void keyPressed(int key);

		vector<string> arguments;

		ofVideoPlayer videoPlayer;
};
