attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float du; /*dimensao tabuleiro*/
uniform float dv;
uniform float su; /*quadricula da posicao selecionada*/
uniform float sv;

uniform vec4 cs;

void main() {

	vec2 cell;
    cell.x = aTextureCoord.x * du;
    cell.y = aTextureCoord.y * dv;

	if((cell.x >= su) && (cell.x < (su+1)) && (cell.y >= sv) && (cell.y < (sv+1))){
		aVertexPosition.y+=0.3;
	}

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}

