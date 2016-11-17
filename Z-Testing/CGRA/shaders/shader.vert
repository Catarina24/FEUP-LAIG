attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

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

	vVertexPosition = aVertexPosition;

	if((cell.x >= su) && (cell.x < (su+1.0)) && (cell.y >= sv) && (cell.y < (sv+1.0))){
		vVertexPosition.z+=0.1;
	}

	gl_Position = uPMatrix * uMVMatrix * vec4(vVertexPosition.x, vVertexPosition.y, vVertexPosition.z, 1.0);

	vTextureCoord = aTextureCoord;
}

