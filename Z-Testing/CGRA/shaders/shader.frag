#ifdef GL_ES
precision highp float;
#endif


varying vec2 vTextureCoord;

uniform float du; /*dimensao tabuleiro*/
uniform float dv;
uniform float su; /*quadricula da posicao selecionada*/
uniform float sv;

uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

uniform sampler2D uSampler;


vec4 selectColor() {

        vec2 cell;
        cell.x = vTextureCoord.x * du;
        cell.y = vTextureCoord.y * dv;

        if((cell.x >= su) && (cell.x < (su+1.0)) && (cell.y >= sv) && (cell.y < (sv+1.0)))
            return cs;
        
        else if (mod(cell.x, 2.0) < 1.0 && mod(cell.y, 2.0) < 1.0)
            return c1;

        else
            return c2;

}


void main() {

        vec4 color = texture2D(uSampler, vTextureCoord);
        vec4 selectedColor = selectColor();

		gl_FragColor =  color * selectedColor;

}
