"use strict;"

let timer,clock;
let time = 25;
let highscore = 0;
let timeCycle = true;
let countdown = true;
let spin = 4;
let bounce = 0;
let points = 0;
let rotate = 0;
let speedx = 0;
let speedy = 0;
let bx = 0;
let by = 0;
let hy = 300;
let hx = 790;
let gravity = 0.35;
let change = 1;
let sounds = [11];
let color = ["yellow","orange","blue","purple","green","red","pink"];

//sound constructor
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls","none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	}
	this.stop = function() {
		this.sound.pause();
	}
}

// randomizes my integers if needed
function random(max,min) {
	return Math.floor(Math.random()*(max-min+1))+ min;
}

function setup() {
	let canvas = document.getElementById("myCanvas");
	let output = document.getElementById("xy");
	
	//my sounds in objects in an array..
	sounds[0] = new sound("music/Intro.mp3");
	sounds[1] = new sound("music/KATY.mp3");
	sounds[2] = new sound("music/AWW.mp3");
	sounds[3] = new sound("music/BADUM.mp3");
	sounds[4] = new sound("music/SLIDE.mp3");
	sounds[5] = new sound("music/FAIL.mp3");
	sounds[6] = new sound("music/BUZZER.mp3");
	sounds[7] = new sound("music/MLG.mp3");
	sounds[8] = new sound("music/SWOOSH1.mp3");
	sounds[9] = new sound("music/SWOOSH2.mp3");
	sounds[10] = new sound("music/SUSPENSE.mp3");
	sounds[0].play();
	
	bx = random(500,80);
	by = random(650,160);
	
	drawBG(timeCycle);
	drawBall(bx,by,0,color[change]);
	drawHoop(hx,hy);
	
	// launches ball using distance from center of the ball to where the mouse clicks
	addEventListener("click", function(event){
		speedx = (bx - event.offsetX)/10;
		speedy = (event.offsetY - by)/7;
		timer = setInterval(moveBall,15);
	});
	
	// displays the speed at which the ball will move once you click
	addEventListener("mousemove", function(event) {
		let ctx = document.getElementById("myCanvas").getContext("2d");
		let spx = bx - event.offsetX;
		let spy = event.offsetY - by;
		output.innerHTML = "Speed >: " + spx/10 + " Speed ^: " + spy/7;
	});
	
	document.getElementById("pointcounter").innerHTML = "Points: " + points;
	document.getElementById("highscore").innerHTML = "HIGHSCORE: " + highscore;
	
}

function moveBall() {
	let ctx = document.getElementById("myCanvas").getContext("2d");
	ctx.clearRect(0,0,800,800);
	bx += speedx;
	// bounce off of the right
	if(bx >= 800) {
		bx = 800 - 40;
		speedx *= -1;
	}
	// bounce off of the left
	if(bx <= 0) {
		bx = 40;
		speedx *= -1;
		bounce++;
		document.getElementById("trick").innerHTML = "TRICK SHOT! Bonus: " + bounce;
	}
	by -= speedy-= gravity;
	//bounce off the front  and back of the hoop
	let front = Math.sqrt(Math.pow(bx-(hx-180),2) + Math.pow(by - (hy-5),2));
	if(front < 40) {
		if(bx < hx-180) {
			speedx *= -0.9;
		}else if(bx > hx-180){
			speedx *= -0.9;
		}
		if(by < hy-5) {
			by-=5;
			speedy*= -0.7;
		} else if(by > hy-5) {
			by+=5;
			speedy*= -0.7;
		}
	}
	let back = Math.sqrt(Math.pow(bx-(hx),2) + Math.pow(by - (hy-5),2))
	if(back < 40) {
		if(bx < hx) {
			speedx *= -1;
		}else if(bx > hx){
			speedx *= -1;
		}
		if(by < hy-5) {
			by-=5;
			speedy*= -0.7;
		} else if(by > hy-5) {
			by+=5;
			speedy*= -0.7;
		}
	}
	//bounce off the backboard
	if(bx >= hx-40 && by < hy+40 && by > hy-180) {
		bx -=5;
		speedx*= -1;
	}
	//add points if ball is in hoop
	if(bx >= hx-180 && bx <= hx && by <= hy+10 && by >= hy - 10 - 20) {
		points++;
		//number of left side bounces add additional points per trick shot
		points+= bounce;
		//game intensifies..
		//starts timer at minimum 5 points
		if(points >= 5) {
			timeCycle = false;
			hy = random(615,185);
			change = random(6,0);
			time+= 3;
			time+= 2*bounce;
			if(countdown) {
				countdown = false;
				time = 25;
				sounds[10].play();
				clock = setInterval(function() {
					time--;
					document.getElementById("timer").innerHTML = "TIME: " + time;
					if(time == 0) {
						ctx.clearRect(0,0,800,800);
						bx = random(500,80);
						by = random(650,160);
						if (points > highscore) {
							highscore = points;
						}
						points = 0;
						rotate = 0;
						hy = 300;
						change = 1;
						bounce = 0;
						countdown = true;
						time = 1;
						timeCycle = true;
						drawBG(timeCycle);
						drawBall(bx,by,rotate,color[1]);
						drawHoop(hx,hy);
						clearInterval(timer);
						clearInterval(clock);
						sounds[6].play();
						document.getElementById("pointcounter").innerHTML = "Points: " + points;
						document.getElementById("highscore").innerHTML = "HIGHSCORE: " + highscore;
						document.getElementById("trick").innerHTML = "";
						document.getElementById("timer").innerHTML = "";
					}
				},800);
			}
		} 
		if(bounce > 0) {
			sounds[7].play();
		} else {
			sounds[random(9,8)].play();
		}
		bounce = 0;
		rotate = 0;
		ctx.clearRect(0,0,800,800);
		bx = random(500,80);
		by = random(650,160);
		drawBG(timeCycle);
		drawBall(bx,by,rotate);
		drawHoop(hx,hy);
		clearInterval(timer);
		document.getElementById("pointcounter").innerHTML = "Points: " + points;
		document.getElementById("trick").innerHTML = "";
		document.getElementById("highscore").innerHTML = "HIGHSCORE: " + highscore;
	}
	// if the ball hits the ground make a new ball at a random location or if timer hits 0
	if(by >= 800) {
		if (points > highscore) {
			highscore = points;
		}
		ctx.clearRect(0,0,800,800);
		bx = random(500,80);
		by = random(650,160);
		points = 0;
		rotate = 0;
		hy = 300;
		change = 1;
		bounce = 0;
		time = 1;
		timeCycle = true;
		countdown = true;
		drawBG(timeCycle);
		drawBall(bx,by,rotate);
		drawHoop(hx,hy);
		clearInterval(timer);
		clearInterval(clock);
		sounds[random(5,1)].play();
		document.getElementById("pointcounter").innerHTML = "Points: " + points;
		document.getElementById("trick").innerHTML = "";
		document.getElementById("timer").innerHTML = "";
		document.getElementById("highscore").innerHTML = "HIGHSCORE: " + highscore;
	}
	drawBG(timeCycle);
	drawBall(bx,by,rotate+=spin,color[change]);
	drawHoop(hx,hy);
}
//radius of ball = 40
function drawBall(x,y,r,color) {
	let ctx = document.getElementById("myCanvas").getContext("2d");
	ctx.save();
	//ball spin
	ctx.translate(x,y);
	ctx.rotate(r*Math.PI/180);
	//ball base
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.fillStyle = color;
	ctx.arc(0,0,40,0,360*Math.PI/180);
	ctx.fill();
	ctx.stroke();
	//details..
	ctx.beginPath();
	ctx.lineWidth = 5;
	ctx.strokeStyle = "black";
	ctx.lineTo(0,40);
	ctx.lineTo(0,-40);
	ctx.moveTo(0,0);
	ctx.lineTo(-40,0);
	ctx.lineTo(40,0);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(-50,0,40,309*Math.PI/180,51*Math.PI/180);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(50,0,40,128*Math.PI/180,232*Math.PI/180);
	ctx.stroke();
	ctx.restore();
}

//hoop size = 160, backboard size 180
function drawHoop(x,y) {
	let ctx = document.getElementById("myCanvas").getContext("2d");
	ctx.save();
	ctx.translate(x,y);
	//backboard
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	ctx.fillStyle = "white";
	ctx.lineTo(0,-180);
	ctx.lineTo(5,-180);
	ctx.lineTo(5,0);
	ctx.lineTo(0,0);
	ctx.lineTo(0,-180);
	ctx.fill();
	ctx.stroke();
	//hoop
	ctx.beginPath();
	ctx.lineWidth = 6;
	ctx.strokeStyle = "#ff3300";
	ctx.lineTo(0,-5);
	ctx.lineTo(-180,-5);
	ctx.stroke();
	ctx.restore();
	
}
//draw background parameter to change from day to night
function drawBG(day) {
	let ctx = document.getElementById("myCanvas").getContext("2d");
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = "#999999";
	ctx.fillStyle = "#999999";
	ctx.lineTo(0,550);
	ctx.lineTo(800,550);
	ctx.lineTo(800,800);
	ctx.lineTo(0,800);
	ctx.lineTo(0,550);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
	
	ctx.save();
	ctx.translate(200,780);
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.lineWidth = 10;
	ctx.arc(0,0,150,90*Math.PI/180,270*Math.PI/180);
	ctx.stroke();
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle ="white";
	ctx.fillStyle = "#ff8080";
	ctx.lineTo(0,150);
	ctx.lineTo(800,150);
	ctx.lineTo(800,-150);
	ctx.lineTo(0,-150);
	ctx.lineTo(0,150);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
	
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = "#339933";
	ctx.fillStyle = "#339933";
	ctx.lineTo(0,550);
	ctx.lineTo(800,550);
	ctx.lineTo(800,450);
	ctx.lineTo(0,450);
	ctx.lineTo(0,550);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
	
	if(day) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#66ccff";
		ctx.fillStyle = "#66ccff";
		ctx.lineTo(0,450);
		ctx.lineTo(800,450);
		ctx.lineTo(800,0);
		ctx.lineTo(0,0);
		ctx.lineTo(0,450);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "yellow";
		ctx.fillStyle = "yellow";
		ctx.arc(20,20,130,0,360*Math.PI/180);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	
		drawCloud(600,100);
		drawCloud(200,170);
		drawCloud(450,290);
		
	} else {
	
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#002b80";
		ctx.fillStyle = "#002b80";
		ctx.lineTo(0,450);
		ctx.lineTo(800,450);
		ctx.lineTo(800,0);
		ctx.lineTo(0,0);
		ctx.lineTo(0,450);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#f2f2f2";
		ctx.fillStyle = "#f2f2f2";
		ctx.arc(20,20,130,0,360*Math.PI/180);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	
	//moon craters
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.arc(90,0,20,0,360*Math.PI/180);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(5,50,25,0,360*Math.PI/180);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(80,80,17,0,360*Math.PI/180);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(140,60,20,100*Math.PI/180,300*Math.PI/180);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(30,130,10,0,360*Math.PI/180);
		ctx.stroke();
		ctx.restore();
	
		drawStar(730,100);
		drawStar(620,170);
		drawStar(450,290);
		drawStar(218,80);
		drawStar(500,120);
		drawStar(250,240);
		drawStar(340,140);
		drawStar(90,210);
		drawStar(120,290);
	}
}

function drawCloud(x,y) {
	let ctx = document.getElementById("myCanvas").getContext("2d");
	ctx.save();
	ctx.translate(x,y);
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	ctx.arc(-35,30,30,0,360*Math.PI/180);
	ctx.arc(0,0,30,0,360*Math.PI/180);
	ctx.arc(35,30,30,0,360*Math.PI/180);
	ctx.arc(0,30,30,0,360*Math.PI/180);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
}

function drawStar(x,y) {
	let ctx = document.getElementById("myCanvas").getContext("2d");
	ctx.save();
	ctx.translate(x,y);
	ctx.beginPath();
	ctx.strokeStyle = "yellow";
	ctx.fillStyle = "yellow";
	ctx.lineTo(0,0);
	ctx.lineTo(10,0);
	ctx.lineTo(0,-10);
	ctx.lineTo(-10,0);
	ctx.lineTo(0,0);
	ctx.stroke();
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = "yellow";
	ctx.fillStyle = "yellow";
	ctx.lineTo(0,0);
	ctx.lineTo(10,0);
	ctx.lineTo(0,10);
	ctx.lineTo(-10,0);
	ctx.lineTo(0,0);
	ctx.stroke();
	ctx.fill();
	ctx.restore();
}

