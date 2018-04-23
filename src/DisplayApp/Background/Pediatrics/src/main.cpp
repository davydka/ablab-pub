#include "ofMain.h"
#include "ofApp.h"

int main(int argc, char *argv[])
{
	ofGLFWWindowSettings settings;
	settings.decorated = false;
	settings.setPosition(ofVec2f(0, 0));
	settings.width = 1080;
	settings.height = 1920;
	// settings.multiMonitorFullScreen = true;
	// settings.windowMode = OF_FULLSCREEN;

	/*
	ofGLWindowSettings settings;
	settings.width = 960;
	settings.height = 540;
	settings.windowMode = OF_WINDOW;
	settings.setGLVersion(4, 1);
	*/

	ofCreateWindow(settings);

	ofApp *app = new ofApp();
	app->arguments = vector<string>(argv, argv + argc);
	ofRunApp(app);
}
