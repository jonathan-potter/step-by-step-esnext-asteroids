#include <common>

const int MAX_THING_COUNT = 50; // asteroids and bullets

uniform vec2 resolution;

uniform float ASTEROID_COUNT;
uniform vec2 ASTEROID_LOCATIONS[MAX_THING_COUNT];
uniform float BULLET_COUNT;
uniform vec2 BULLET_LOCATIONS[MAX_THING_COUNT];
uniform vec2 SHIP_LOCATION;

const int GRID_SQUARE_COUNT = 10;

#define TIMESCALE 0.25
#define TILES 9.0
#define ASTEROID_COLOR 1.0, 1.0, 1.0
#define BULLET_COLOR 1.0, 0.3, 0.3
#define SHIP_COLOR 1.0, 1.0, 1.0

float shipOffsets[3];

float distanceFromNearestThing ( vec2 location, vec2 thingLocations[MAX_THING_COUNT], float count ) {
    float distance = resolution.y;

    for (int i = 0; i < MAX_THING_COUNT; i++) {
        if (count <= float(i)) {
            return distance;
        }

        float diff = length(location - thingLocations[i]);

        if (diff < distance) {
            distance = diff;
        }
    }

    return distance;
}

float distanceFromShip ( vec2 location ) {
    float distance = 999.0;
    shipOffsets[0] = -520.0;
    shipOffsets[1] = 0.0;
    shipOffsets[2] = 520.0;

    for (int x = 0; x < 3; x++) {
        for (int y = 0; y < 3; y++) {
            vec2 offset = vec2(shipOffsets[x], shipOffsets[y]);
            vec2 shipLocation = SHIP_LOCATION + offset;

            float offsetDistance = length(location - shipLocation);
            if (offsetDistance < distance) {
                distance = offsetDistance;
            }
        }
    }

    return distance;
}

float brightness ( float distance, vec2 uv ) {
    float p = pow(1.0 - distance / resolution.y, 10.0);

	vec2 r = mod(uv * TILES, 1.0);
	r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
	return p * pow(min(1.0, 12.0 * dot(r, r)), 2.0);
}

void main() {
    vec2 location = gl_FragCoord.xy;

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv.x *= resolution.x / resolution.y;

    // float ambient = brightness( 45.0, uv );
    float bullet = brightness(distanceFromNearestThing( location, BULLET_LOCATIONS, BULLET_COUNT ), uv );
    float asteroid = brightness(distanceFromNearestThing( location, ASTEROID_LOCATIONS, ASTEROID_COUNT ), uv );
    float ship = brightness(distanceFromShip( location ), uv );

    gl_FragColor = (
        vec4(BULLET_COLOR, 1.0) * bullet * 2.0 +
        vec4(ASTEROID_COLOR, 1.0) * asteroid +
        vec4(SHIP_COLOR, 1.0) * ship * 2.0
    );
}
