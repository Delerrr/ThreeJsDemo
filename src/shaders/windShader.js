/**
 * Full-screen textured quad shader
 */

const WindShader = {

    name: 'WindShader',

    uniforms: {
        'iTime': { value: 0.1 },
        'tDiffuse': { value: null },
    },

    vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

    fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    uniform float iTime;

    #define OCTAVES  8.0
    #define LIVE_SMOKE 1

    float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    float rand2(vec2 co){
    return fract(cos(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    // Rough Value noise implementation
    float valueNoiseSimple(vec2 vl) {
    float minStep = 1.0 ;

    vec2 grid = floor(vl);
    vec2 gridPnt1 = grid;
    vec2 gridPnt2 = vec2(grid.x, grid.y + minStep);
    vec2 gridPnt3 = vec2(grid.x + minStep, grid.y);
    vec2 gridPnt4 = vec2(gridPnt3.x, gridPnt2.y);

        float s = rand2(grid);
        float t = rand2(gridPnt3);
        float u = rand2(gridPnt2);
        float v = rand2(gridPnt4);
        
        float x1 = smoothstep(0., 1., fract(vl.x));
        float interpX1 = mix(s, t, x1);
        float interpX2 = mix(u, v, x1);
        
        float y = smoothstep(0., 1., fract(vl.y));
        float interpY = mix(interpX1, interpX2, y);
        
        return interpY;
    }

    float fractalNoise(vec2 vl) {
        float persistance = 2.0;
        float amplitude = 0.5;
        float rez = 0.0;
        vec2 p = vl;
        
        for (float i = 0.0; i < OCTAVES; i++) {
            rez += amplitude * valueNoiseSimple(p);
            amplitude /= persistance;
            p *= persistance;
        }
        return rez;
    }

    float complexFBM(vec2 p) {
        float sound = 0.5;
        float slow = iTime / 2.5;
        float fast = iTime / .5;
        vec2 offset1 = vec2(slow  , 0.); // Main front
        vec2 offset2 = vec2(sin(fast )* 0.1, 0.); // sub fronts

        return 
    #if LIVE_SMOKE
            (1. + sound) * 
    #endif
            fractalNoise( p + offset1 + fractalNoise(
                    p + fractalNoise(
                        p + 2. * fractalNoise(p - offset2)
                    )
                )
            );
    }


    void main()
    {
        vec4 transparent = vec4(0,0,0,0);
        vec4 smoke = vec4(0.513725, 0.98039, 0.90196,1);
        
        vec4 res = mix(smoke, transparent, complexFBM(vUv));
        
        vec4 texel = texture2D( tDiffuse, vUv );
        gl_FragColor = res + texel;
    }`

}

export { WindShader };