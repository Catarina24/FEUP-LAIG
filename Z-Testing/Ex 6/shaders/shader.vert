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

varying vec2 vTextureCoord;

void main() {

	vec3 vertexPosition;

	vertexPosition = aVertexPosition;

	vec2 cell;	
    cell.x = aTextureCoord.x * du;
    cell.y = aTextureCoord.y * dv;

	

	if((cell.x >= su) && (cell.x <= (su+1.0)) && (cell.y >= sv) && (cell.y <= (sv+1.0))){
		vertexPosition.z+=0.1;
	}

	gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition.x, vertexPosition.y, vertexPosition.z, 1.0);

	vTextureCoord = aTextureCoord;
}

