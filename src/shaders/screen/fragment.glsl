varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uAdjustUv;
uniform float uScale;

void main()
{
  vec2 uv = vec2(0.5) + vUv * uAdjustUv - uAdjustUv*0.5;
  vec3 color = vec3(0.2);
  float rot = -3.14159265359 / 2.0;
  uv-=.5;
  mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
  uv = m * uv;
  uv = (uv - 0.5) * uScale + (0.5 * uScale);
  uv+=.5;
  if (uv.x>=0.0 && uv.y>=0.0 && uv.x<1.0 && uv.y<1.0) color = texture2D(uTexture, uv).rgb;
  gl_FragColor = vec4(color, 1.0);
}
