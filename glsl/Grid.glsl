#include <common>

const int MAX_BULLET_COUNT = 100;

uniform vec3 resolution;
uniform float time;

uniform float BULLET_COUNT;
uniform vec2 BULLET_LOCATIONS[MAX_BULLET_COUNT];
uniform vec2  SHIP_LOCATION;

const int GRID_SQUARE_COUNT = 10;

#define TIMESCALE 0.25
#define TILES 8.0
#define BULLET_COLOR 1.0, 0.0, 0.0
#define SHIP_COLOR 1.0, 1.0, 1.0

float distanceFromNearestBullet ( vec2 location ) {
    float distance = resolution.y;

    for (int i = 0; i < MAX_BULLET_COUNT; i++) {
        if (BULLET_COUNT <= float(i)) {
            return distance;
        }

        float diff = length(location - BULLET_LOCATIONS[i]);

        if (diff < distance) {
            distance = diff;
        }
    }

    return distance;
}

float distanceFromShip ( vec2 location ) {
    return length(location - SHIP_LOCATION);
}

float brightness ( float distance, vec2 uv ) {
    float p = pow(1.0 - distance / resolution.y, 10.0);

	vec2 r = mod(uv * TILES, 1.0);
	r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
	p *= pow(min(1.0, 12.0 * dot(r, r)), 2.0);

    return p;
}

void main() {
    vec2 location = gl_FragCoord.xy;

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv.x *= resolution.x / resolution.y;

    float bullet = brightness(distanceFromNearestBullet( location ), uv );
    float ship = brightness(distanceFromShip( location ), uv );

    gl_FragColor = vec4(BULLET_COLOR, 1.0) * bullet + vec4(SHIP_COLOR, 1.0) * ship;
}
