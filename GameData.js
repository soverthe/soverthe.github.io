//<script> //(you can switch the Notepad++ language to HTML to make events look nicer :>)
	
	var currentGame = {currentState: "Game Selection", states: []};
	var selectedGame = "";
	
	var gameSaves = { //(the trophies are currently unused)
		"Creature Pather": {score: null, text: ""},
		"Not-So-Quick Save": {score: null, text: "Clicks", trophies: {gold: 36, silver: 143, bronze: 250, mode: "less"}},
		"Shape-Shifting Minesweeper": {score: {Tiny: null, Medium: null, Huge: null}, text: "Explosions", trophies: {gold: 0, silver: 2, bronze: 5, mode: "less"}, sizes: ["Tiny", "Medium", "Huge", "Massive"]},
		"Countries Quiz": {score: null, text: "First Tries", trophies: {gold: 198, silver: 100, bronze: 20, mode: "more"}},
		"''Fascinating'' ''Possibilities''": {score: null, text: "Clicks", trophies: {gold: null, silver: null, bronze: null, mode: "less"}},
		"Knight Patterns": {score: null, text: ""},
	};
	
	currentGame.states = Object.keys(gameSaves);
	
	var currentVideos = [];
	
	var shouldConfirmBeforeClosing = (location.href[0] != "f");
	
	var gameData = {};
	
	gameData = {
		...gameData,
		
		"Creature Pather": {
			overriddenVariables: {
				drawOrder: ["drawEntities", "drawSelectionBox", "drawButtons", "drawScrollbars"],
				
				inputButtons: {
					undo: {keyboard: ["KeyZ"], requiredKeyboard: ["Control"], timer: 0, maxTimer: 4, initialTimer: 40, disableHold: false, onclick: ["undoArrayUndo"], condition: "gameState.currentState == 'art'"},
					redo: {keyboard: ["KeyY"], requiredKeyboard: ["Control"], timer: 0, maxTimer: 4, initialTimer: 40, disableHold: false, onclick: ["undoArrayRedo"], condition: "gameState.currentState == 'art'"},
					deleteSelected: {keyboard: ["Delete", "Backspace"], timer: 0, maxTimer: 0, disableHold: true, onclick: ["deleteSelectedVertices"], condition: "gameState.currentState == 'art'"},
					
					createVertexSelect: {keyboard: ["KeyQ"], timer: 0, maxTimer: 0, disableHold: true, onclick: ["<<drawTool.currentState = 'createVertex';>>"], condition: "gameState.currentState == 'art'"},
					selectAndMoveSelect: {keyboard: ["KeyW"], timer: 0, maxTimer: 0, disableHold: true, onclick: ["<<drawTool.currentState = 'selectAndMove';>>"], condition: "gameState.currentState == 'art'"},
					changeVertexSelect: {keyboard: ["KeyE"], timer: 0, maxTimer: 0, disableHold: true, onclick: ["<<drawTool.currentState = 'changeVertex';>>"], condition: "gameState.currentState == 'art'"},
					scaleSelect: {keyboard: ["KeyA"], timer: 0, maxTimer: 0, disableHold: true, onclick: ["<<drawTool.currentState = 'scale';>>"], condition: "gameState.currentState == 'art'"},
					rotateSelect: {keyboard: ["KeyS"], timer: 0, maxTimer: 0, disableHold: true, onclick: ["<<drawTool.currentState = 'rotate';>>"], condition: "gameState.currentState == 'art'"},
				},
				
				events: {
					onload: ["generateArtButtons", "switchToGame", "refreshScrollbars"],
					onNextFrame: ["moveEntities", "moveCharacter", "saveCurrentShapeToUndoArray", "refreshLayerButtons", "draw", "artNextFrame"],
					
					gamesEvents: {
						switchToArt: [`<<{
							gameState.currentState = "art"; drawTool.currentState = drawTool.savedState;
							shouldEditPolygons = true; entities[1].showBox = true; entities[1].showPoints = true;
							camera.x = 0; camera.y = 0; camera.zoom.level = 0.3; camera.state.canZoom = true;
						}>>`],
						switchToGame: [`<<{
							gameState.currentState = "game"; drawTool.savedState = drawTool.currentState; drawTool.currentState = '';
							shouldEditPolygons = false; entities[1].showBox = true; entities[1].showPoints = false;
							camera.x = 0; camera.y = 1000; camera.zoom.level = 0.1; camera.state.canZoom = false;
							
							let isDrawn = false;
							for (let i in entities[1].pos.arr){
								if (objectLength(entities[1].pos.arr[i]) > 0){
									if (entities[1].isVisible?.[i] ?? entities[1].isVisible){
										isDrawn = true;
									}
								}
							}
							
							let arr = [
								{pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Edit Creature", textSize: 0.125, onclick: ["switchToArt"], isAbsolutePositioned: true},
								
								{pos: {x: 0.075, y: 0.81, w: 0.1, h: 0.2}, text: "🕴", sprites: [entities[1]], textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton},
								
								{...gamePresets.quitButton},
							];
							if (isDrawn){
								let isResultsLocked = !(findCreatureLevel != 0 && findTheDifferenceLevel != 0 && personalityValuesText != "" && (objectLength(relationValues) != 0) && digitValue != "");
								
								arr = [
									...arr,
									{pos: {x: 0.2, y: 0.25, w: 0.2, h: 0.15}, text: "Find Creature", textSize: 0.125, onclick: ["switchToFindCreature"], isAbsolutePositioned: true, downscaleTextLength: 14,
									subtext: ((findCreatureLevel > 0) ? ("Level: " + findCreatureLevel) : ""), subtextPos: {x: 0, y: 0.3}},
									{pos: {x: 0.5, y: 0.25, w: 0.2, h: 0.15}, text: "Find The Difference", textSize: 0.125, onclick: ["switchToFindTheDifference"], isAbsolutePositioned: true, downscaleTextLength: 14,
									subtext: (((findTheDifferenceLevel-1) > 0) ? ("Level: " + (findTheDifferenceLevel-1)) : ""), subtextPos: {x: 0, y: 0.3}},
									{pos: {x: 0.8, y: 0.25, w: 0.2, h: 0.15}, text: "Personality Test", textSize: 0.125, onclick: ["switchToPersonalityTest"], isAbsolutePositioned: true, downscaleTextLength: 14,
									subtext: ((personalityValuesText != "") ? (personalityValuesText) : ""), subtextPos: {x: 0, y: 0.3}, downscaleSubtextLength: 1000},
									{pos: {x: 0.2, y: 0.55, w: 0.2, h: 0.15}, text: "Which Digit Is It", textSize: 0.125, onclick: ["switchToDigit"], isAbsolutePositioned: true, downscaleTextLength: 14,
									subtext: ((digitResults[digitValue] != undefined) ? ("Digit: " + digitResults[digitValue]) : ""), subtextPos: {x: 0, y: 0.3}},
									{pos: {x: 0.5, y: 0.55, w: 0.2, h: 0.15}, text: "Relations Chart", textSize: 0.125, onclick: ["switchToRelationsChart"], isAbsolutePositioned: true, downscaleTextLength: 14},
									{pos: {x: 0.8, y: 0.55, w: 0.2, h: 0.15}, text: "Results", textSize: 0.125, onclick: ["switchToResults"], isAbsolutePositioned: true, downscaleTextLength: 14,
									isLocked: isResultsLocked, lockedTitle: "(play all 5 games to unlock)", lockedText: "[Locked]"},
								];
							} else{
								arr = [
									...arr,
									{pos: {x: 0.5, y: 0.5, w: 0.1, h: 0.2}, text: "Click 'Edit Creature' to create a creature\\nthen come back here for games 'v' ;s; =w=",
									textSize: 0.25, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
								];
							}
							buttons.game = arr;
						}>>`],
						switchToFindCreature: [`<<{
							gameState.currentState = "findCreature";
							
							let arr = [
								{...gamePresets.quitButton},
							];
							
							if (findCreatureLevel < 1 || findCreatureLives < 1){
								arr.push(
									{pos: {x: 0.5, y: 0.5, w: 0.1, h: 0.045}, textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, ...gamePresets.textButton,
									text: "Click your original creature out of the copies\\nevery level becomes harder\\n\\nCurrent Levels: "+findCreatureLevel, textColor: "gameText"},
								);
								arr.push({pos: {x: 0.5, y: 0.8, w: 0.15, h: 0.085}, text: ((findCreatureLives == 3) ? "Start" : "Restart"), textSize: 0.2,
									onclick: ["<<findCreatureLives = 3;>>","<<findCreatureLevel = 1;>>","switchToFindCreature"], isAbsolutePositioned: true});
								arr.push({pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Back", textSize: 0.125, onclick: ["switchToGame"], isAbsolutePositioned: true});
							} else{
								let buttonsNum = 8;
								let correctNum = getRandomNum({min: 0, max: buttonsNum-1});
								
								for (let k = 0; k < buttonsNum; k++){
									let entity = structuredClone(entities[1]);
									entity.showBox = false;
									
									if (k != correctNum){
										let offsetNum = 1/((findCreatureLevel-1) * 30 + 10);
										let offset = {
											x: getRandomNumWithDecimals({min: offsetNum / 2, max: offsetNum}),
											y: getRandomNumWithDecimals({min: offsetNum / 2, max: offsetNum})
										};
										
										let changesNum = 0;
										let verticesNum = 2000;
										while (changesNum < verticesNum){
											verticesNum = 0;
											for (let i in entity.pos.arr){
												for (let j in entity.pos.arr[i]){
													if (Math.random() < 0.1){ offset.x *= -1; }
													if (Math.random() < 0.1){ offset.y *= -1; }
													
													if (Math.random() < 0.3){
														entity.pos.arr[i][j].x += offset.x;
														entity.pos.arr[i][j].y += offset.y;
														
														if (Math.random() > 0.5){
															if (entity.pos.arr[i][j].front != undefined){
																entity.pos.arr[i][j].front.x += offset.x;
																entity.pos.arr[i][j].front.y += offset.y;
															}
															if (entity.pos.arr[i][j].back != undefined){
																entity.pos.arr[i][j].back.x += offset.x;
																entity.pos.arr[i][j].back.y += offset.y;
															}
														}
														
														changesNum++;
													}
													verticesNum++;
												}
											}
										}
									}
									arr.push(
										{pos: {x: 0.2 + (k%4) * 0.2, y: 0.225 + Math.floor(k/4) * 0.4, w: 0.175, h: 0.35}, text: "🕴", sprites: [entity],
										textSize: 1.25, isAbsolutePositioned: true, color: "#ffffff44",
										onclick: ["<<findCreatureLevel += "+((k != correctNum) ? "0" : "1")+";>>","<<findCreatureLives -= "+((k != correctNum) ? "1" : "0")+";>>","switchToFindCreature"]},
									)
								}
								
								let livesSprites = [];
								for (let lifeNum of range(3)){ livesSprites.push((lifeNum < findCreatureLives) ? "heartBig" : "heartBigEmpty"); }
								arr.push(
									{pos: {x: 0.5, y: 0.9, w: 0.1, h: 0.045}, text: "Level: "+findCreatureLevel+"\\n🕴 🕴 🕴", sprites: livesSprites, textColor: "gameText",
									textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, ...gamePresets.textButton},
								);
							}
							
							buttons.findCreature = arr;
						}>>`],
						switchToFindTheDifference: [`<<{
							gameState.currentState = "findTheDifference";
							
							let arr = [
								{...gamePresets.quitButton},
							];
							
							let hasGuessableButtons = false;
							
							if (findTheDifferenceLevel < 1 || findTheDifferenceLevel > 5 || findTheDifferenceLives < 1){
								arr.push(
									{pos: {x: 0.5, y: 0.5, w: 0.1, h: 0.045}, textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, ...gamePresets.textButton,
									text: "Click on things that aren't in both pictures\\nPlay until you beat all 5 levels or until you run out of lives\\nThere are 5 differences each level" +
									((findTheDifferenceLevel-1 > 0) ? "\\n\\nCurrent Levels: " + (findTheDifferenceLevel-1) : ""), textColor: "gameText"},
								);
								arr.push({pos: {x: 0.5, y: 0.8, w: 0.15, h: 0.085}, text: ((findTheDifferenceLives != 0) ? "Start" : "Restart"), textSize: 0.2,
									onclick: ["<<findTheDifferenceLives = 3;>>","<<findTheDifferenceLevel = 1;>>","<<findTheDifferenceButtons = [];>>","switchToFindTheDifference"], isAbsolutePositioned: true});
								arr.push({pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Back", textSize: 0.125, onclick: ["switchToGame"], isAbsolutePositioned: true});
								
								hasGuessableButtons = true;
							} else{
								arr.push({pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Back", textSize: 0.125, onclick: ["<<findTheDifferenceLives = 0;>>", "switchToFindTheDifference"], isAbsolutePositioned: true});
								
								let center = {
									left: {x: -camera.x - 2.22, y: -camera.y - 0.22},
									right: {x: -camera.x + 2.22, y: -camera.y - 0.22}
								};
								
								for (let i in findTheDifferenceButtons){
									if (findTheDifferenceButtons[i].hiddenSide != undefined && !findTheDifferenceButtons[i].isText){
										hasGuessableButtons = true;
									}
								}
								
								if (!hasGuessableButtons){
									if (findTheDifferenceButtons.length > 0){
										findTheDifferenceLevel++;
									}
									
									findTheDifferenceButtons = [
										{x: 0, y: 0, w: 3, h: 3, sprite: "pictureNight"},
									];
									
									let currentButtons = [];
									
									let counts = {...findTheDifferenceCounts};
									for (let k in counts){
										if (k != "differences"){
											counts[k] *= findTheDifferenceLevel * ((findTheDifferenceLevel < 4) ? 1 : findTheDifferenceLevel/3);
										}
									}
									
									let creatureSprite = {...entities[1], showBox: false};
									
									let spritesArr = {
										stars: ["basicStar", "basicStarRotated", "basicMoon"],
										trees: ["pineTree", "pineTree", "pineTree", "pineTree", "pineTree", "alienBuilding"],
										roof: ["pigeon"],
										left: ["pigeon", creatureSprite, creatureSprite],
										right: ["pigeon", "leafSheepSlug", creatureSprite, creatureSprite],
										window: ["leafSheepSlug", {...entities[1], showBox: false}, "pictureNight", "circles", "happyFeesh"],
										road: ["leafSheepSlug", {...entities[1], showBox: false}],
									};
									
									for (let k = 0; k < counts.stars; k++){
										let pos = {x: getRandomNumWithDecimals({min: -1, max: 1.35}), y: getRandomNumWithDecimals({min: -1.35, max: -0.7})};
										
										if (Math.random() < 0.35){
											pos = {x: getRandomNumWithDecimals({min: -1.35, max: -0.45}), y: getRandomNumWithDecimals({min: -1.35, max: -0.45})};
										}
										
										currentButtons.push({x: pos.x, y: pos.y, w: 0.1, h: 0.1, sprite: getRandomElementOfArray(spritesArr.stars), isText: true});
									}
									
									let treeSprite = getRandomElementOfArray(spritesArr.trees);
									for (let k = 0; k < counts.trees; k++){
										let num = 0.25;
										let pos = {x: getRandomNumWithDecimals({min: -1.3 + num, max: -0.2 - num}), y: getRandomNumWithDecimals({min: 0 + num, max: 0.8 - num})};
										
										currentButtons.push({x: pos.x, y: pos.y, w: 1, h: 1, sprite: treeSprite, isText: true});
									}
									
									sortObjectByValue(currentButtons, "y", true);
									findTheDifferenceButtons = [...findTheDifferenceButtons, ...currentButtons];
									currentButtons = [];
									
									for (let k = 0; k < counts.roof; k++){
										let pos = {x: getRandomNumWithDecimals({min: 0, max: 1}), y: getRandomNumWithDecimals({min: -0.65, max: -0.325})};
										
										pos.x = ((0.7 - (pos.y+0.65)) + pos.x*(0.2 + (pos.y+0.65)*1.6));
										
										currentButtons.push({x: pos.x, y: pos.y, w: 0.2, h: 0.2, sprite: getRandomElementOfArray(spritesArr.roof), isText: true});
									}
									for (let k = 0; k < counts.left; k++){
										let pos = {x: getRandomNumWithDecimals({min: -1.3, max: -0.2}), y: getRandomNumWithDecimals({min: 0, max: 1})};
										
										currentButtons.push({x: pos.x, y: pos.y, w: 0.25, h: 0.25, sprite: getRandomElementOfArray(spritesArr.left), isText: true});
									}
									for (let k = 0; k < counts.right; k++){
										let pos = {x: getRandomNumWithDecimals({min: 0.5, max: 1.25}), y: getRandomNumWithDecimals({min: 0.35, max: 1.25})};
										
										currentButtons.push({x: pos.x, y: pos.y, w: 0.25, h: 0.25, sprite: getRandomElementOfArray(spritesArr.right), isText: true});
									}
									
									if (Math.random() < 0.5){
										currentButtons.push({x: 0.895, y: 0.1, w: 0.1, h: 0.1, sprite: getRandomElementOfArray(spritesArr.window), isText: true});
									}
									
									if (findTheDifferenceLevel > 2){
										let roadSprite = getRandomElementOfArray(spritesArr.road);
										currentButtons.push({x: 0.3, y: 0.55, w: 0.25, h: 0.25, sprite: roadSprite, isText: true});
										currentButtons.push({x: 0.25, y: 0.65, w: 0.35, h: 0.35, sprite: roadSprite, isText: true});
										currentButtons.push({x: 0.15, y: 0.8, w: 0.45, h: 0.45, sprite: roadSprite, isText: true});
										currentButtons.push({x: 0, y: 0.95, w: 0.55, h: 0.55, sprite: roadSprite, isText: true});
										currentButtons.push({x: -0.15, y: 1.1, w: 0.7, h: 0.7, sprite: roadSprite, isText: true});
									}
									
									sortObjectByValue(currentButtons, "y", true);
									findTheDifferenceButtons = [...findTheDifferenceButtons, ...currentButtons];
									currentButtons = [];
									
									
									let differencesArr = [];
									while (differencesArr.length < Math.min(counts.differences, findTheDifferenceButtons.length - 1)){
										let num = getRandomNum({min: 1, max: findTheDifferenceButtons.length - 1});
										
										if (!differencesArr.includes(num)){
											differencesArr.push(num);
										}
									}
									for (let k = 0; k < differencesArr.length; k++){
										findTheDifferenceButtons[differencesArr[k]].isText = false;
										findTheDifferenceButtons[differencesArr[k]].hiddenSide = (Math.random() < 0.2) ? "left" : "right";
									}
								}
								
								for (let leftRight in center){
									for (let k in findTheDifferenceButtons){
										let button = findTheDifferenceButtons[k];
										
										arr.push({
											pos: {x: center[leftRight].x + button.x, y: center[leftRight].y + button.y, w: button.w, h: button.h},
											text: ((button.hiddenSide != leftRight) ? "🕴" : ""), sprites: [button.sprite], textSize: 1.55,
											color: "#00000000", hoverColor: "#00000000", disableClick: button.isText,
											borderColor: "#ff4400", borderSize: ((button.hiddenSide != undefined && button.isText) ? 0.01 : 0),
											onclick: [
											((button.hiddenSide != undefined) ? "<<findTheDifferenceButtons["+k+"].isText = true;>>" : "<<findTheDifferenceLives--;>>"),
											"switchToFindTheDifference"]
										});
									}
								}
								
								let livesSprites = [];
								for (let lifeNum of range(3)){ livesSprites.push((lifeNum < findTheDifferenceLives) ? "heartBig" : "heartBigEmpty"); }
								arr.push(
									{pos: {x: 0.5, y: 0.9, w: 0.1, h: 0.045}, text: "Level: "+findTheDifferenceLevel+"\\n🕴 🕴 🕴", sprites: livesSprites, textColor: "gameText",
									textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, ...gamePresets.textButton},
								);
							}
							
							buttons.findTheDifference = arr;
							
							if (!hasGuessableButtons){
								runEvent("switchToFindTheDifference");
							}
						}>>`],
						refreshPersonalityValuesText: [`<<{
							let text = 	((personalityValues.introvertExtrovert > 0) ? "E": "I") + ((personalityValues.observantIntuitive > 0) ? "N": "S") +
										((personalityValues.thinkingFeeling > 0) ? "F": "T") + ((personalityValues.judgingProspecting > 0) ? "P": "J") +
										((personalityValues.natureCity > 0) ? "C": "N") +
										((personalityValues.badGood > 0) ? personalityValues.badGood+1 : personalityValues.badGood+2) +
										((personalityValues.chaoticLawful > 0) ? personalityValues.chaoticLawful+1 : personalityValues.chaoticLawful+2);
							
							for (let i in fearsArr){
								if (personalityValues["fear" + fearsArr[i]]){
									text += fearsArr[i][0].toUpperCase() + fearsArr[i][1];
								}
							}
							personalityValuesText = text;
						}>>`],
						switchToPersonalityTest: [`<<{
							gameState.currentState = "personalityTest";
							
							let questions = [
								{text: "Do they get recharged when hanging out with other creatures?", type: "introvertExtrovert"},
								{text: "Do they prefer novelty over stability?", type: "observantIntuitive"},
								{text: "Do they prioritize emotions over logic?", type: "thinkingFeeling"},
								{text: "Do they prefer spontaneity over certainty?\\n(when choosing from options)", type: "judgingProspecting"},
								
								{text: "Would they rather be in cities over being in nature?", type: "natureCity"},
								{text: "Do they try to make the world a better place?", type: "badGood"},
								{text: "Do they follow the rules?", type: "chaoticLawful"},
								
								{text: "Toggle on the fears they might have:", type: "fears"},
							];
							
							let currentQuestion = questions[personalityTestPhase - 1];
							
							if (currentQuestion == undefined){
								personalityTestPhase = 0;
							}
							
							let arr = [
								{...gamePresets.quitButton},
							];
							if (personalityTestPhase > 0){
								arr.push({pos: {x: 0.16, y: 0.81, w: 0.1, h: 0.045}, text: "<- them", textSize: 0.125, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton});
								arr.push({pos: {x: 0.075, y: 0.81, w: 0.1, h: 0.2}, text: "🕴", sprites: [entities[1]], textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton});
							}
							
							if (personalityTestPhase == 0){
								if (objectLength(personalityValues) > 0){
									runEvent("refreshPersonalityValuesText");
								}
								
								arr.push(
									{pos: {x: 0.5, y: 0.5, w: 0.1, h: 0.045}, textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, ...gamePresets.textButton,
									text: "Answer personality questions\\nbased on what your creature would answer" +
									((personalityValuesText != "") ? ("\\nTheir Personality: " + personalityValuesText) : ""), textColor: "gameText"},
								);
								arr.push({pos: {x: 0.5, y: 0.75, w: 0.15, h: 0.085}, text: ((objectLength(personalityValues) == 0) ? "Start" : "Restart"), textSize: 0.2, isAbsolutePositioned: true,
								onclick: ["<<let shouldStart = true; if(objectLength(personalityValues) != 0){ shouldStart = confirm('Would you like to restart the personality quiz?'); } if (shouldStart){ personalityValues = {}; personalityTestPhase++; }>>","switchToPersonalityTest"]});
								
								arr.push({pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Back", textSize: 0.125, onclick: ["switchToGame"], isAbsolutePositioned: true});
							} else{
								if (currentQuestion.type == "fears"){
									for (let k = 0; k < fearsArr.length; k++){
										let num = k - 2 + ((k > 1) ? 1 : 0);
										let name = "fear" + fearsArr[k];
										
										let color = (personalityValues[name] != true) ? "#222222" : "hsl("+fearHues[k]+",100%,50%)";
										arr.push(
											{pos: {x: 0.125 + (k%6) * 0.15, y: 0.53 + 0.075*((k>5) ? 1 : -1), w: 0.12, h: 0.1}, text: fearsArr[k].replaceAll("tive stru", "tive\\nstru"), textSize: 0.125, isAbsolutePositioned: true,
											color: color, textColor: color, outlineColor: "#fff", outlineSize: 0.006, marginY: 0.1,
											onclick: ['<<personalityValues["'+name+'"] = '+((personalityValues[name]) ? false : true)+';>>',"switchToPersonalityTest"]},
										);
									}
									arr.push(
										{pos: {x: 0.5, y: 0.8, w: 0.13, h: 0.085}, text: "Done", textSize: 0.125, isAbsolutePositioned: true,
										onclick: ["<<personalityTestPhase++;>>","switchToPersonalityTest"]},
									);
								} else{
									let answersArr = ["never", "rarely", "often", "always"];
									let answerHues = [20,35,85,135];
									
									for (let k = 0; k < answersArr.length; k++){
										let num = k - 2 + ((k > 1) ? 1 : 0);
										let color = "hsl("+answerHues[k]+",100%,50%)";
										arr.push(
											{pos: {x: 0.2 + k * 0.2, y: 0.5, w: 0.175, h: 0.085}, text: answersArr[k], textSize: 0.125, isAbsolutePositioned: true,
											color: color, textColor: color, outlineColor: "#fff", outlineSize: 0.008,
											onclick: ["<<personalityValues['"+currentQuestion.type+"'] = "+num+";>>","<<personalityTestPhase++;>>","switchToPersonalityTest"]},
										);
									}
								}
								arr.push(
									{pos: {x: 0.5, y: 0.3, w: 0.1, h: 0.045}, text: currentQuestion.text,
									textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
								);
							}
							
							buttons.personalityTest = arr;
						}>>`],
						switchToDigit: [`<<{
							gameState.currentState = "digit";
							
							let questions = [
								"Are they popular?",
								"Are they mysterious?",
								"Would you trust them to build your house?",
								"Are they emotionally stable?"
							];
							
							let arr = [
								{...gamePresets.quitButton},
							];
							if (digitValue.length > 0 && digitResults[digitValue] == undefined){
								arr.push({pos: {x: 0.16, y: 0.81, w: 0.1, h: 0.045}, text: "<- them", textSize: 0.125, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton});
								arr.push({pos: {x: 0.075, y: 0.81, w: 0.1, h: 0.2}, text: "🕴", sprites: [entities[1]], textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton});
							}
							
							if ((digitValue != "start" && digitValue.length == 0) || digitResults[digitValue] != undefined){
								arr.push(
									{pos: {x: 0.5, y: 0.5, w: 0.1, h: 0.045}, textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, ...gamePresets.textButton,
									text: "Answer questions about your creature\\nthen you get which digit from 0 to 9 they are" +
									((digitResults[digitValue] != undefined) ? ("\\nTheir Digit: " + digitResults[digitValue]) : ""), textColor: "gameText"},
								);
								arr.push({pos: {x: 0.5, y: 0.75, w: 0.15, h: 0.085}, text: ((digitValue.length == 0) ? "Start" : "Restart"), textSize: 0.2, isAbsolutePositioned: true,
								onclick: ["<<digitValue = 'start';>>","switchToDigit"]});
								
								arr.push({pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Back", textSize: 0.125, onclick: ["switchToGame"], isAbsolutePositioned: true});
							} else{
								let currentQuestion = questions[((digitValue == "start") ? 0 : digitValue.length)];
								
								let answersArr = ["no", "yes"];
								let answerHues = [20,135];
								
								for (let k = 0; k < answersArr.length; k++){
									let num = k - 2 + ((k > 1) ? 1 : 0);
									let color = "hsl("+answerHues[k]+",100%,50%)";
									arr.push(
										{pos: {x: 0.4 + k * 0.2, y: 0.5, w: 0.175, h: 0.085}, text: answersArr[k], textSize: 0.125, isAbsolutePositioned: true,
										color: color, textColor: color, outlineColor: "#fff", outlineSize: 0.008,
										onclick: ["<<if (digitValue == 'start'){ digitValue = ''; }>>","<<digitValue += '"+answersArr[k][0]+"';>>","switchToDigit"]},
									);
								}
								
								arr.push(
									{pos: {x: 0.5, y: 0.3, w: 0.1, h: 0.045}, text: currentQuestion,
									textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
								);
							}
							
							buttons.digit = arr;
						}>>`],
						switchToRelationsChart: [`<<{
							gameState.currentState = "relationsChart";
							
							let relationCreatures = [
								{name: "pigeon", text: "A collectivist bird trying to make ends meet.\\nWill love you in exchange for food", personality: "ESTPC20FoLi"},
								{name: "leafSheepSlug", text: "Peaceful slug in the ocean.\\nEats algae and uses it to photosynthesize.\\nWill shock you if feels threatened", personality: "ISFJN12Fo"},
								{name: "pineTree", text: "Humble pine tree.\\nUsually found in colder climates.\\nWon't give up leaves for anything", personality: "ESTJN23SpLiFa"},
								{name: "trustworthyFace", text: "A highly trustworthy person.\\nIs self-conscious about appearing untrustworthy.\\nTerrified of bugs", personality: "INTPN30SuDiSm"},
								{name: "pictureNight", text: "A picturesque photo-realistic picture.\\nPrefers solitude but sometimes throws parties\\nwith a lot of attendees", personality: "ISFJN33Sp"},
								{name: "circles", text: "A group of circles always up for supporting each other.\\nHave absolutely no care about anyone else.\\nThe reigning champions of Find Creature", personality: "ESTJC10SuDi"},
								{name: "emptyBox", text: "The default symbol for development purposes.\\nWill always support you in everything unconditionally", personality: "ISTJC33"},
								{name: "drunkSlug", text: "A sea slug many many many beers in.\\nVery contradictory and is happy sad about it", personality: "ENFPN11OxSm"},
								{name: "happyFeesh", text: "A happy feesh.\\nVery friendly but might not love you if you're a worm", personality: "ENFJN32AlFoSpSuDiBiUn"},
								{name: "alienBuilding", text: "A living building, possibly built by aliens.\\nMany otherworldly inventions were found inside.\\nSeems safe enough", personality: "ISFPC21DiFi"},
							];
							
							let currentCreature = relationCreatures[relationsChartPhase - 1];
							
							if (currentCreature == undefined){
								relationsChartPhase = 0;
							}
							
							let arr = [
								{...gamePresets.quitButton},
							];
							if (relationsChartPhase > 0 && false){
								arr.push({pos: {x: 0.16, y: 0.81, w: 0.1, h: 0.045}, text: "<- them", textSize: 0.125, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton});
								arr.push({pos: {x: 0.075, y: 0.81, w: 0.1, h: 0.2}, text: "🕴", sprites: [entities[1]], textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton});
							}
							
							if (relationsChartPhase == 0){
								arr.push(
									{pos: {x: 0.5, y: 0.5, w: 0.1, h: 0.045}, textSize: 0.25, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton,
									text: "Decide what relations your creature would have with others"},
								);
								arr.push({pos: {x: 0.5, y: 0.75, w: 0.15, h: 0.085}, text: ((objectLength(relationValues) == 0) ? "Start" : "Restart"), textSize: 0.2, isAbsolutePositioned: true,
								onclick: ["<<let shouldStart = true; if(objectLength(relationValues) != 0){ shouldStart = confirm('Would you like to restart the relations chart test quiz perfectly-made no-flaws trivia?'); } if (shouldStart){ relationValues = {}; relationsChartPhase++; }>>","switchToRelationsChart"]});
								
								arr.push({pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Back", textSize: 0.125, onclick: ["switchToGame"], isAbsolutePositioned: true});
							} else{
								arr.push({pos: {x: 0.25, y: 0.25, w: 0.2, h: 0.2}, text: "🕴", sprites: [{...gameSprites[currentCreature.name], showBox: true}], textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton});
								
								let fearsPos = {x: 0.7, y: 0.225};
								
								arr.push(
									{pos: {x: fearsPos.x, y: fearsPos.y - 0.115, w: 0.1, h: 0.045}, text: "fears:",
									textSize: 0.15, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
								);
								
								for (let k = 0; k < fearsArr.length; k++){
									let name = fearsArr[k][0].toUpperCase() + fearsArr[k][1];
									let hasFear = (currentCreature.personality.includes(name));
									
									let size = (hasFear) ? {w: 0.08, h: 0.075} : {w: 0.08/2.25, h: 0.075/2.25};
									let color = (hasFear) ? "hsl("+fearHues[k]+",100%,50%)" : "#222222";
									
									arr.push(
										{pos: {x: fearsPos.x + (k%6 - 2.5) * 0.085, y: fearsPos.y + 0.04*((k>5) ? 1 : -1), w: size.w, h: size.h}, downscaleTextLength: 13,
										text: ((hasFear) ? fearsArr[k].replaceAll("tive stru", "tive\\nstru") : ""), textSize: 0.135, isAbsolutePositioned: true,
										color: color, textColor: color, outlineColor: "#fff", outlineSize: 0.006, marginY: 0.1, disableClick: true},
									);
								}
								
								
								let alignments = [
									["good", "okay", "baddie", "evil"],
									["lawful", "lawish", "chaoticish", "chaotic"]
								];
								let alignmentPos = {x: 0.75, y: 0.55};
								
								arr.push(
									{pos: {x: alignmentPos.x, y: alignmentPos.y - 0.135, w: 0.1, h: 0.045}, text: "alignment:",
									textSize: 0.15, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
								);
								
								for (let k = 0; k < 16; k++){
									let color = (false) ? "hsl("+fearHues[k]+",100%,50%)" : "#222222";
									let num = (3-Number(currentCreature.personality[5])) + (3-Number(currentCreature.personality[6]))*4;
									
									arr.push(
										{pos: {x: alignmentPos.x + (Math.floor(k/4) - 1.5) * 0.08, y: alignmentPos.y + 0.05*(k%4 - 1.5), w: 0.081, h: 0.051},
										text: alignments[1][Math.floor(k/4)] + " " + alignments[0][k%4], textSize: 0.135, downscaleTextLength: 12, isAbsolutePositioned: true,
										color: (k == num) ? "#fff" : color, textColor: (k == num) ? color : "#fff", outlineColor: "#fff", outlineSize: 0.006*0, marginY: 0.1, disableClick: true},
									);
								}
								
								
								let answersPos = {x: 0.5, y: 0.885};
								
								arr.push(
									{pos: {x: answersPos.x, y: answersPos.y - 0.11, w: 0.15, h: 0.045}, text: "who are they to your creature?",
									textSize: 0.15, marginY: 0.1, textColor: "#ffffff", outlineColor: "#222222", outlineSize: 0.006, isAbsolutePositioned: true, ...gamePresets.textButton},
								);
								
								for (let k = 0; k < relationTypes.length; k++){
									let num = k;
									let color = "hsl("+relationHues[k]+",100%,50%)";
									if (k == 3){ color = "hsl(0,0%,50%)"; }
									arr.push(
										{pos: {x: answersPos.x + (k-3) * 0.125, y: answersPos.y, w: 0.1, h: 0.085}, text: relationTypes[k], textSize: 0.135, isAbsolutePositioned: true,
										color: color, textColor: color, outlineColor: "#fff", outlineSize: 0.01,
										onclick: ["<<relationValues['"+currentCreature.name+"'] = "+num+";>>","<<relationsChartPhase++;>>","switchToRelationsChart"]},
									);
								}
								
								arr.push(
									{pos: {x: 0.25, y: 0.47, w: 0.1, h: 0.045}, text: currentCreature.personality.slice(0, 4) + " (" + ((currentCreature.personality[4] == "C") ? "city" : "nature") + ")",
									textSize: 0.1, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
								);
								
								arr.push(
									{pos: {x: 0.25, y: 0.55, w: 0.1, h: 0.045}, text: currentCreature.text + " 🕴", sprites: [currentCreature.name], spriteSize: 1.35,
									textSize: 0.15, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
								);
							}
							
							buttons.relationsChart = arr;
						}>>`],
						switchToResults: [`<<{
							gameState.currentState = "results";
							
							let arr = [
								{pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Back", textSize: 0.125, onclick: ["switchToGame"], isAbsolutePositioned: true},
								
								{...gamePresets.quitButton},
							];
							
							let fearsPos = {x: 0.7, y: 0.225};
							
							arr.push(
								{pos: {x: fearsPos.x, y: fearsPos.y - 0.115, w: 0.1, h: 0.045}, text: "fears:",
								textSize: 0.15, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
							);
							
							for (let k = 0; k < fearsArr.length; k++){
								let name = fearsArr[k][0].toUpperCase() + fearsArr[k][1];
								let hasFear = (personalityValuesText.includes(name));
								
								let size = (hasFear) ? {w: 0.08, h: 0.075} : {w: 0.08/2.25, h: 0.075/2.25};
								let color = (hasFear) ? "hsl("+fearHues[k]+",100%,50%)" : "#222222";
								
								arr.push(
									{pos: {x: fearsPos.x + (k%6 - 2.5) * 0.085, y: fearsPos.y + 0.04*((k>5) ? 1 : -1), w: size.w, h: size.h}, downscaleTextLength: 13,
									text: ((hasFear) ? fearsArr[k].replaceAll("tive stru", "tive\\nstru") : ""), textSize: 0.135, isAbsolutePositioned: true,
									color: color, textColor: color, outlineColor: "#fff", outlineSize: 0.006, marginY: 0.1, disableClick: true},
								);
							}
							
							
							let alignments = [
								["good", "okay", "baddie", "evil"],
								["lawful", "lawish", "chaoticish", "chaotic"]
							];
							let alignmentPos = {x: 0.75, y: 0.55};
							
							arr.push(
								{pos: {x: alignmentPos.x, y: alignmentPos.y - 0.135, w: 0.1, h: 0.045}, text: "alignment:",
								textSize: 0.15, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
							);
							
							for (let k = 0; k < 16; k++){
								let color = (false) ? "hsl("+fearHues[k]+",100%,50%)" : "#222222";
								let num = (3-Number(personalityValuesText[5])) + (3-Number(personalityValuesText[6]))*4;
								
								arr.push(
									{pos: {x: alignmentPos.x + (Math.floor(k/4) - 1.5) * 0.08, y: alignmentPos.y + 0.05*(k%4 - 1.5), w: 0.081, h: 0.051},
									text: alignments[1][Math.floor(k/4)] + " " + alignments[0][k%4], textSize: 0.135, downscaleTextLength: 12, isAbsolutePositioned: true,
									color: (k == num) ? "#fff" : color, textColor: (k == num) ? color : "#fff", outlineColor: "#fff", outlineSize: 0.006*0, marginY: 0.1, disableClick: true},
								);
							}
							
							
							arr.push({pos: {x: 0.2, y: 0.25, w: 0.2, h: 0.2}, text: "🕴", sprites: [{...entities[1], showBox: true}], textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton});
							
							arr.push(
								{pos: {x: 0.2, y: 0.47, w: 0.1, h: 0.045}, text: personalityValuesText.slice(0, 4) + " (" + ((personalityValuesText[4] == "C") ? "city" : "nature") + ")",
								textSize: 0.1, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
							);
							
							arr.push(
								{pos: {x: 0.2, y: 0.54, w: 0.1, h: 0.045}, text: "#" + digitResults[digitValue] + "\\ndetectability: " + findCreatureLevel + "\\nfindability: " + (findTheDifferenceLevel-1) + "/5",
								textSize: 0.1, marginY: 0.1, isAbsolutePositioned: true, textColor: "gameText", ...gamePresets.textButton},
							);
							
							
							let kNum = 0;
							let relationsNum = objectLength(relationValues);
							let relationsPos = {x: 0.42, y: 0.73, w: 0.04, h: 0.04};
							let relationsRadius = {x: 0.1, y: 0.2};
							
							let linesSprite = {pos: {arr: {}, "shape": "polygon"}, lineWidth: 0.01, color: {}, isFill: false, fillOutline: false, isVisible: true};
							
							for (let k in relationValues){
								let pos = {
									x: relationsPos.x + Math.cos(kNum/relationsNum * Math.PI*2) * relationsRadius.x,
									y: relationsPos.y + Math.sin(kNum/relationsNum * Math.PI*2) * relationsRadius.y,
									w: relationsPos.w, h: relationsPos.h
								};
								
								arr.push({pos: pos, text: "🕴", sprites: [{...gameSprites[k]}], textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton});
								
								let linePos = {x: pos.x - relationsPos.x, y: pos.y - relationsPos.y};
								let currentColor = ((relationHues[relationValues[k]] > 0) ? "hsl("+relationHues[relationValues[k]]+",100%,50%)" : "hsl(0,0%,50%)");
								
								linesSprite.pos.arr["line"+kNum] = [{x: linePos.x * 2, y: linePos.y}, {x: linePos.x * 2.75 * 2, y: linePos.y * 2.75}];
								linesSprite.color["line"+kNum] = currentColor;
								
								kNum++;
							}
							
							arr.push({pos: {x: relationsPos.x, y: relationsPos.y, w: 0.2, h: 0.2}, text: "🕴", sprites: [{...linesSprite, showBox: false}],
									  textSize: 1, isAbsolutePositioned: true, ...gamePresets.textButton});
							
							arr.push({pos: {x: relationsPos.x, y: relationsPos.y, w: relationsPos.w, h: relationsPos.h}, text: "🕴", sprites: [{...entities[1], showBox: false}],
									  textSize: 1.5, isAbsolutePositioned: true, ...gamePresets.textButton});
									  
							
							buttons.results = arr;
						}>>`],
					},
					
					pathArtEvents: {
						refreshScrollbars: ["<<scrollbarsArr.art = {x: {start: -1, end: 1}, y: {start: -1, end: 1}};>>"],
						
						undoRedoEvents: {
							saveCurrentShape: [`<<{
								let arr = {};
								
								for (let i of saveKeys){
									arr[i] = entities[1][i];
								}
								
								saveText = stringify(arr);
								
								let keys = ["x","y","back","front","arr","undefined","null", ...saveKeys];
								
								for (let i in keys){
									saveText = saveText.replaceAll('"' + keys[i] + '"', keys[i]);
								}
							}>>`],
							
							saveCurrentShapeToUndoArray: [`<<{
								if (!isMouseDown){
									runEvent("saveCurrentShape");
									
									if ((undoArray[currentUndoNum] ?? undoArray[currentUndoNum - 1]) != saveText){
										if (undoArray[currentUndoNum] != undefined){
											undoArray = undoArray.slice(0, currentUndoNum + 1);
										}
										
										undoArray.push(saveText);
										
										currentUndoNum++;
									}
								}
							}>>`],
							
							undoArrayUndo: ["<<currentUndoNum = Math.max(0, Math.min(currentUndoNum - 1, undoArray.length - 2));>>", "loadUndoArrayShape"],
							undoArrayRedo: ["<<currentUndoNum = Math.min(currentUndoNum + 1, undoArray.length - 1);>>", "loadUndoArrayShape"],
							
							loadUndoArrayShape: [`<<{
								functionEval('entities[1] = {...entities[1], ...' + undoArray[currentUndoNum] + '}');
								
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i]?.layer]?.[selectedArtVertices[i]?.num] == undefined){
										selectedArtVertices = [{num: -1, layer: Object.keys(entities[1].pos.arr)[0]}];
									}
								}
							}>>`],
						},
						
						refreshLayerButtons: [`<<{
							let layerButtons = [];
							
							let i = {
								num: 0,
								max: Math.max(4, objectLength(entities[1].pos.arr)),
								trueMax: objectLength(entities[1].pos.arr)
							};
							
							let leftPos = 0.885;
							
							for (let layerName in entities[1].pos.arr){
								let y = (i.num - i.max/2)/i.max * 0.6 + 0.7;
								y = ((i.trueMax-1-i.num) - i.max/2)/i.max * 0.6 + 0.7;
								
								layerButtons.push({
									pos: {x: leftPos + 0.01, y: y, w: 0.01, h: 0.3/i.max}, isAbsolutePositioned: true,
									text: "↓", isLocked: (i.num == 0),
									textSize: 1, id: "layerButton", type: "moveDown", layerNum: i.num,
									onclick: [\`<<{
										let num = \`+i.num+\`;
										let arr = {};
										let layerNames = Object.keys(entities[1].pos.arr);
										
										for (let i = 0; i < layerNames.length; i++){
											let layerName = layerNames[i];
											if (i != num){
												if (i + 1 == num){
													arr[layerNames[i + 1]] = entities[1].pos.arr[layerNames[i + 1]];
													arr[layerName] = entities[1].pos.arr[layerName];
												} else{
													arr[layerName] = entities[1].pos.arr[layerName];
												}
											}
										}
										
										entities[1].pos.arr = arr;
									}>>\`],
								});
								layerButtons.push({
									pos: {x: leftPos, y: y, w: 0.01, h: 0.3/i.max}, isAbsolutePositioned: true,
									text: "↑", isLocked: (i.num == i.trueMax - 1),
									textSize: 1, id: "layerButton", type: "moveUp", layerNum: i.num,
									onclick: [\`<<{
										let num = \`+i.num+\`;
										let arr = {};
										let layerNames = Object.keys(entities[1].pos.arr);
										
										for (let i = 0; i < layerNames.length; i++){
											let layerName = layerNames[i];
											if (i != num){
												if (i - 1 == num){
													arr[layerName] = entities[1].pos.arr[layerName];
													arr[layerNames[i - 1]] = entities[1].pos.arr[layerNames[i - 1]];
												} else{
													arr[layerName] = entities[1].pos.arr[layerName];
												}
											}
										}
										
										entities[1].pos.arr = arr;
									}>>\`],
								});
								
								layerButtons.push({
									pos: {x: leftPos + 0.06, y: y, w: 0.01, h: 0.3/i.max}, isAbsolutePositioned: true,
									text: (entities[1].isVisible[layerName] != false) ? "@" : "-", title: (entities[1].isVisible[layerName] != false) ? "Hide" : "Show",
									textSize: 1, id: "layerButton", type: "hide", layerNum: i.num, isInHideState: (entities[1].isVisible[layerName] != false),
									onclick: [\`<<{
										let num = \`+i.num+\`;
										let layerNames = Object.keys(entities[1].pos.arr);
										
										let name = layerNames[num];
										
										if (!isObject(entities[1].isVisible)){
											entities[1].isVisible = {};
										}
										
										entities[1].isVisible[name] = !(entities[1].isVisible[name] ?? true);
										
										if (entities[1].isVisible[name]){
											delete entities[1].isVisible[name];
										}
										
										if (objectLength(entities[1].isVisible) < 1){
											entities[1].isVisible = true;
										}
									}>>\`],
								});
								layerButtons.push({
									pos: {x: leftPos + 0.07, y: y, w: 0.01, h: 0.3/i.max}, isAbsolutePositioned: true,
									text: "🖋", title: "Rename", textSize: 1, id: "layerButton", type: "rename", layerNum: i.num,
									onclick: [\`<<{
										let newName = prompt("New Layer Name:");
										
										if (newName != null && !newName.includes(String.fromCharCode(92)) && !newName.includes("'") && !newName.includes('"') &&
											!newName.includes(String.fromCharCode(96)) && !("0123456789".includes(newName[0]))){
											let num = \`+i.num+\`;
											let layerNames = Object.keys(entities[1].pos.arr);
											
											let oldName = layerNames[num];
											
											if (entities[1].pos.arr[oldName] != undefined && entities[1].pos.arr[newName] == undefined){
												entities[1].pos.arr[newName] = entities[1].pos.arr[oldName];
												delete entities[1].pos.arr[oldName];
												
												for (let i in entities[1]){
													if (isObject(entities[1][i]) && entities[1][i][oldName] != undefined && saveKeys.includes(i)){
														entities[1][i][newName] = entities[1][i][oldName];
														delete entities[1][i][oldName];
													}
												}
												
												selectedArtVertices = [{num: -1, layer: newName}];
											}
										}
									}>>\`],
								});
								layerButtons.push({
									pos: {x: leftPos + 0.08, y: y, w: 0.01, h: 0.3/i.max}, isAbsolutePositioned: true,
									text: "c", title: "Clone", textSize: 1, id: "layerButton", type: "clone", layerNum: i.num,
									onclick: [\`<<{
										let layerNum = \`+i.num+\`;
										let layerNames = Object.keys(entities[1].pos.arr);
										let oldName = layerNames[layerNum];
										
										let num = "";
										
										for (let i = oldName.length - 1; i >= 0; i--){
											if (!isNaN(oldName[i])){
												num = oldName[i] + num;
												
												oldName = oldName.slice(0, i);
											} else{
												i = -1;
											}
										}
										
										if (num == ""){ num = "1"; }
										
										num = Number(num);
										
										let newName = oldName + num;
										while (entities[1].pos.arr[newName] != undefined){
											num++;
											newName = oldName + num;
										}
										
										oldName = layerNames[layerNum];
										
										if (entities[1].pos.arr[newName] == undefined){
											entities[1].pos.arr[newName] = structuredClone(entities[1].pos.arr[oldName]);
										}
										
										for (let i in entities[1]){
											if (entities[1][i][oldName] != undefined){
												entities[1][i][newName] = structuredClone(entities[1][i][oldName])
											}
										}
										
										/*selectedArtVertices = [{num: -1, layer: newName}];*/
									}>>\`],
								});
								layerButtons.push({
									pos: {x: leftPos + 0.09, y: y, w: 0.01, h: 0.3/i.max}, isAbsolutePositioned: true,
									text: "x", title: "Delete", textSize: 1, id: "layerButton", type: "delete", layerNum: i.num,
									isLocked: (objectLength(entities[1].pos.arr) < 2),
									onclick: [\`<<{
										let num = \`+i.num+\`;
										let layerNames = Object.keys(entities[1].pos.arr);
										
										let name = layerNames[num];
										
										if (entities[1].pos.arr[name] != undefined && objectLength(entities[1].pos.arr) > 1){
											delete entities[1].pos.arr[name];
											
											for (let i in entities[1]){
												if (isObject(entities[1][i]) && entities[1][i][name] != undefined && saveKeys.includes(i)){
													delete entities[1][i][name];
												}
											}
											
											selectedArtVertices = [{num: -1, layer: Object.keys(entities[1].pos.arr)[0]}];
										}
									}>>\`],
								});
								
								layerButtons.push({
									pos: {x: leftPos + 0.035, y: y, w: 0.04, h: 0.3/i.max}, isAbsolutePositioned: true,
									text: (entities[1].isVisible[layerName] != false) ? layerName : "[hidden]", downscaleTextLength: 8, color: entities[1].color?.[layerName] ?? "#fff",
									textColor: ((selectedArtVertices[0].layer == layerName) ? "#000" : "#fff"), outlineSize: 0.0025,
									outlineColor: ((selectedArtVertices[0].layer == layerName) ? "#fff" : "#000"),
									borderSize: ((selectedArtVertices[0].layer == layerName) ? 0.00125 : 0), borderColor: "#000",
									textSize: 0.165, id: "layerButton", onclick: ["<<selectedArtVertices = [{num: -1, layer: '"+layerName+"'}];>>"],
								});
								
								
								i.num++;
							}
							
							layerButtons.push({
								pos: {x: 0.93, y: 0.32, w: 0.1, h: 0.05}, isAbsolutePositioned: true,
								text: "New Layer", downscaleTextLength: 14, id: "layerButton",
								textSize: 0.125, onclick: [\`<<{
									let num = 1;
									let text = "layer" + num;
									while (entities[1].pos.arr[text] != undefined){
										num++;
										text = "layer" + num;
									}
									
									if (entities[1].pos.arr[text] == undefined){
										entities[1].pos.arr[text] = [];
									}
									
									selectedArtVertices = [{num: -1, layer: text}];
								}>>\`],
							});
							
							
							removeButtonsById("layerButton");
							buttons.art.push(...layerButtons);
						}>>`],
						
						selectionEvents: {
							selectClickedVertex: [`<<{
								let currentVertex = {num: clickedPolygonVertex.j, layer: clickedPolygonVertex.layer};
								
								let isShiftDown = (inputs.ShiftLeft || inputs.ShiftRight);
								
								if (!isObjectInArray(currentVertex, selectedArtVertices)){
									if (isShiftDown && selectedArtVertices[0].num != -1){
										selectedArtVertices.unshift(currentVertex);
									} else{
										selectedArtVertices = [currentVertex];
									}
								}
							}>>`],
							deleteSelectedVertices: [`<<{
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num] != undefined){
										entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num] = "Remove";
									}
								}
								
								for (let layerName in entities[1].pos.arr){
									for (let vertexNum = 0; vertexNum < entities[1].pos.arr[layerName].length; vertexNum++){
										if (entities[1].pos.arr[layerName][vertexNum] == "Remove"){
											entities[1].pos.arr[layerName].splice(vertexNum, 1);
											vertexNum--;
										}
									}
								}
								selectedArtVertices = [{num: -1, layer: selectedArtVertices[0].layer}];
								clickedPolygonVertex.i = -1;
							}>>`],
							moveSelectedToEdge: [`<<{
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num] != undefined){
										let pos = entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num];
										let prevPos = {...pos};
										
										if (Math.abs(Math.abs(pos.x) - 0.5) < Math.abs(Math.abs(pos.y) - 0.5)){
											if (pos.x > 0){ pos.x = 0.5; } else{ pos.x = -0.5; }
										} else{
											if (pos.y > 0){ pos.y = 0.5; } else{ pos.y = -0.5; }
										}
										
										if (Math.abs(Math.abs(pos.x) - 0.5) < 0.05){ pos.x = (pos.x > 0) ? 0.5 : -0.5; }
										if (Math.abs(Math.abs(pos.y) - 0.5) < 0.05){ pos.y = (pos.y > 0) ? 0.5 : -0.5; }
										
										if (pos.back != undefined){ pos.back.x += pos.x - prevPos.x; pos.back.y += pos.y - prevPos.y; }
										if (pos.front != undefined){ pos.front.x += pos.x - prevPos.x; pos.front.y += pos.y - prevPos.y; }
										
										entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num] = pos;
									}
								}
							}>>`],
							duplicateSelectedVertices: [`<<{
								let currentSelectedArtVertices = [];
								
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num] != undefined){
										let currentIndex = entities[1].pos.arr[selectedArtVertices[i].layer].length;
										
										entities[1].pos.arr[selectedArtVertices[i].layer][currentIndex] = structuredClone(entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num]);
										
										currentSelectedArtVertices.push({num: currentIndex, layer: selectedArtVertices[i].layer});
									}
								}
								
								if (currentSelectedArtVertices.length > 0){
									selectedArtVertices = currentSelectedArtVertices;
								}
							}>>`],
							cloneSelectedLayers: [`<<{
								let selectedLayers = [];
								
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num] != undefined){
										if (!selectedLayers.includes(selectedArtVertices[i].layer)){
											selectedLayers.push(selectedArtVertices[i].layer);
										}
									}
								}
								
								
								let currentSelectedArtVertices = [];
								
								for (let i in selectedLayers){
									let currentNum = Object.keys(entities[1].pos.arr).indexOf(selectedLayers[i]);
									
									for (let j in buttons.art){
										if (buttons.art[j].type == "clone" && buttons.art[j].layerNum == currentNum){
											runEvent(buttons.art[j].onclick);
											
											let layersArr = Object.keys(entities[1].pos.arr);
											
											for (let k = 0; k < entities[1].pos.arr[layersArr[layersArr.length - 1]].length; k++){
												currentSelectedArtVertices.push({num: k, layer: layersArr[layersArr.length - 1]});
											}
										}
									}
								}
								
								if (currentSelectedArtVertices.length > 0){
									selectedArtVertices = currentSelectedArtVertices;
								}
							}>>`],
							selectAllVerticesOfSelectedLayers: [`<<{
								let selectedLayers = [];
								
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num] != undefined){
										if (!selectedLayers.includes(selectedArtVertices[i].layer)){
											selectedLayers.push(selectedArtVertices[i].layer);
										}
									}
								}
								
								
								let currentSelectedArtVertices = [];
								
								for (let i in selectedLayers){
									for (let k = 0; k < entities[1].pos.arr[selectedLayers[i]].length; k++){
										currentSelectedArtVertices.push({num: k, layer: selectedLayers[i]});
									}
								}
								
								if (currentSelectedArtVertices.length > 0){
									selectedArtVertices = currentSelectedArtVertices;
								}
							}>>`],
							moveSelectedLayersUp: [`<<{
								let selectedLayers = [];
								
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num] != undefined){
										if (!selectedLayers.includes(selectedArtVertices[i].layer)){
											selectedLayers.unshift(selectedArtVertices[i].layer);
										}
									}
								}
								
								for (let i = 0; i < selectedLayers.length; i++){
									let currentNum = Object.keys(entities[1].pos.arr).indexOf(selectedLayers[i]);
									
									for (let j in buttons.art){
										if (buttons.art[j].type == "moveUp" && buttons.art[j].layerNum == currentNum){
											if (Object.keys(entities[1].pos.arr).length - currentNum > 1 + i){
												runEvent(buttons.art[j].onclick);
											}
										}
									}
								}
							}>>`],
							moveSelectedLayersDown: [`<<{
								let selectedLayers = [];
								
								for (let i in selectedArtVertices){
									if (entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num] != undefined){
										if (!selectedLayers.includes(selectedArtVertices[i].layer)){
											selectedLayers.push(selectedArtVertices[i].layer);
										}
									}
								}
								
								for (let i = 0; i < selectedLayers.length; i++){
									let currentNum = Object.keys(entities[1].pos.arr).indexOf(selectedLayers[i]);
									
									for (let j in buttons.art){
										if (buttons.art[j].type == "moveDown" && buttons.art[j].layerNum == currentNum){
											if (currentNum > i){
												runEvent(buttons.art[j].onclick);
											}
										}
									}
								}
							}>>`],
							
							drawSelectionBox: [`<<
								if (gameState.currentState == "art"){
									let isShiftDown = (inputs.ShiftLeft || inputs.ShiftRight);
									
									if (multipleSelectPos.rect != undefined){
										ctx.fillStyle = "#0022ff22";
										drawRect(multipleSelectPos.rect);
									}
									
									if (multipleMovePos?.mousePos != undefined && (drawTool.currentState != "selectAndMove" || isShiftDown)){
										ctx.fillStyle = "#ffffff88";
										drawRect({...getScaledPosition(multipleMovePos.mousePos), ...{w: 10, h: 10}}, {isCentered: true, isScaled: false});
									}
									
									for (let i in selectedArtVertices){
										ctx.fillStyle = "#0022ff66";
										drawRect({...getScaledPosition(entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num]), ...{w: 20, h: 20}}, {isCentered: true, isScaled: false});
									}
								}
							>>`],
						},
						
						artNextFrame: [`<<{
							changeButtonArgsById("outlineColorButton", {isHidden: !(entities[1].isFill[selectedArtVertices[0].layer] ?? entities[1].isFill ?? false)});
							
							for (let i in buttons.art){
								if (buttons.art[i].id2 == "toolButtons"){
									buttons.art[i].borderColor = (drawTool.currentState == buttons.art[i].id) ? "#222222" : "#00000000";
									buttons.art[i].borderSize = (drawTool.currentState == buttons.art[i].id) ? 0.002 : undefined;
									buttons.art[i].color = (drawTool.currentState == buttons.art[i].id) ? "#555555" : "#ffffff";
									buttons.art[i].textColor = (drawTool.currentState == buttons.art[i].id) ? "#ffffff" : "#000000";
								}
							}
							
							switch (drawTool.currentState){
								case "createVertex": {
									if (wasEmptyMouseDown && mouseButton == 1 && entities[1].isVisible[selectedArtVertices[0].layer] != false){
										wasEmptyMouseDown = false;
										
										let currentLayer = selectedArtVertices[0].layer;
										
										selectedArtVertices = [{num: Math.min(selectedArtVertices[0].num, entities[1].pos.arr[currentLayer].length - 1)}];
										
										let index = Number(selectedArtVertices[0].num);
										
										let pos = {
											x: (scaledMousePos.x - entities[1].boxPos.x) / (entities[1].boxPos.w ?? 1),
											y: (scaledMousePos.y - entities[1].boxPos.y) / (entities[1].boxPos.h ?? 1),
										};
										
										let arr = {front: {x: 1, y: 1}, back: {x: -1, y: -1}};
										if (entities[1].pos.arr[currentLayer][index + 1] != undefined){
											arr.front = getVertexToVertexDirection(pos, entities[1].pos.arr[currentLayer][index + 1]);
										}
										if (entities[1].pos.arr[currentLayer][index] != undefined){
											arr.back = getVertexToVertexDirection(pos, entities[1].pos.arr[currentLayer][index]);
											arr.front = {x: -arr.back.x, y: -arr.back.y};
										}
										
										entities[1].pos.arr[currentLayer].splice(index + 1, 0, {
											...pos,
											front: {x: pos.x + arr.front.x*0.02, y: pos.y + arr.front.y*0.02},
											back: {x: pos.x + arr.back.x*0.02, y: pos.y + arr.back.y*0.02}
										});
										
										selectedArtVertices = [{num: index + 1, layer: currentLayer}];
										clickedPolygonVertex = {i: "art", layer: selectedArtVertices[0].layer, j: selectedArtVertices[0].num, type: "front"};
									}
									disablePolygonEditMovement = false;
									
									let isControlDown = (inputs.ControlLeft || inputs.ControlRight);
									if (clickedPolygonVertex.i == "art" && ((selectedArtVertices[0]?.layer == clickedPolygonVertex.layer) || !isControlDown)){
										runEvent("selectClickedVertex");
									}
								} break;
								case "changeVertex": {
									if (clickedPolygonVertex.i == "art"){
										runEvent("selectClickedVertex");
										
										for (let i in selectedArtVertices){
											let arr = entities[1].pos.arr[selectedArtVertices[i].layer]?.[selectedArtVertices[i].num];
											
											if (arr != undefined){
												let newArr = {x: arr.x, y: arr.y};
												
												if (arr.back != undefined || arr.front == undefined){
													newArr.front = arr.front ?? {x: arr.x + 0.02, y: arr.y + 0.02};
												}
												if (arr.back == undefined && arr.front == undefined){
													newArr.back = arr.back ?? {x: arr.x - 0.02, y: arr.y - 0.02};
												}
												
												entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num] = newArr;
											}
										}
										
										clickedPolygonVertex.i = -1;
									}
								} break;
								case "selectAndMove": {
									let isShiftDown = (inputs.ShiftLeft || inputs.ShiftRight);
									let isControlDown = (inputs.ControlLeft || inputs.ControlRight);
									
									let pos = {
										x: (scaledMousePos.x - entities[1].boxPos.x) / (entities[1].boxPos.w ?? 1),
										y: (scaledMousePos.y - entities[1].boxPos.y) / (entities[1].boxPos.h ?? 1),
									};
									
									if (multipleSelectPos.start != undefined){
										let arr = {
											big: {x: Math.max(multipleSelectPos.start.x, pos.x), y: Math.max(multipleSelectPos.start.y, pos.y)},
											small: {x: Math.min(multipleSelectPos.start.x, pos.x), y: Math.min(multipleSelectPos.start.y, pos.y)}
										};
										
										multipleSelectPos.rect = {
											x: arr.small.x,
											y: arr.small.y,
											w: arr.big.x - arr.small.x,
											h: arr.big.y - arr.small.y
										};
										
									}
									
									if (multipleSelectPos.start == undefined){
										/*Select Clicked Vertex*/
										if (clickedPolygonVertex.i == "art" && ((selectedArtVertices[0]?.layer == clickedPolygonVertex.layer) || !isControlDown)){
											runEvent("selectClickedVertex");
										}
										
										if (wasEmptyMouseDown){
											/*Start Selection Box*/
											wasEmptyMouseDown = false;
											multipleSelectPos.start = pos;
											multipleMovePos = undefined;
										} else{
											/*Move Multiple Selected Vertices*/
											if (isMouseDown && clickedPolygonVertex.i == "art" && clickedPolygonVertex.type == "vertex"){
												if (multipleMovePos == undefined){
													multipleMovePos = {mousePos: scaledMousePos, startingPos: []};
													
													for (let i in selectedArtVertices){
														multipleMovePos.startingPos[i] = structuredClone(entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num]);
													}
												} else{
													for (let i in selectedArtVertices){
														let arr = entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num];
														let movementPos = {x: multipleMovePos.mousePos.x - scaledMousePos.x, y: multipleMovePos.mousePos.y - scaledMousePos.y};
														
														if (isShiftDown){
															let ratio = Math.max(Math.abs(movementPos.x), 0.0001) / Math.max(Math.abs(movementPos.y), 0.0001);
															
															if (ratio > 2){
																movementPos.x = movementPos.x;
																movementPos.y = 0;
															} else if (ratio < 0.5){
																movementPos.x = 0;
																movementPos.y = movementPos.y;
															} else{
																movementPos.x = movementPos.y * (((movementPos.x < 0) != (movementPos.y < 0)) ? -1 : 1);
																movementPos.y = movementPos.y;
															}
														}
														
														if (multipleMovePos.startingPos[i] != undefined){
															arr.x = multipleMovePos.startingPos[i].x - movementPos.x;
															arr.y = multipleMovePos.startingPos[i].y - movementPos.y;
															
															if (multipleMovePos.startingPos[i].front != undefined){
																arr.front.x = multipleMovePos.startingPos[i].front.x - movementPos.x;
																arr.front.y = multipleMovePos.startingPos[i].front.y - movementPos.y;
															}
															if (multipleMovePos.startingPos[i].back != undefined){
																arr.back.x = multipleMovePos.startingPos[i].back.x - movementPos.x;
																arr.back.y = multipleMovePos.startingPos[i].back.y - movementPos.y;
															}
														}
													}
												}
											} else{
												multipleMovePos = undefined;
											}
										}
									} else {
										/*Move Selection Box*/
										let verticesArr = [];
										for (let layerName in entities[1].pos.arr){
											if (entities[1].isVisible[layerName] != false){
												if ((selectedArtVertices[0]?.layer == layerName) || !isControlDown){
													for (let vertexNum in entities[1].pos.arr[layerName]){
														let vertexPos = entities[1].pos.arr[layerName][vertexNum];
														
														if (isVertexInRect(vertexPos, multipleSelectPos.rect)){
															verticesArr.push({num: vertexNum, layer: layerName});
														}
													}
												}
											}
										}
										if (verticesArr.length > 0){
											if (isShiftDown && selectedArtVertices[0].num != -1){
												selectedArtVertices = [...verticesArr, ...selectedArtVertices];
												
												selectedArtVertices = removeDuplicateObjectsInArray(selectedArtVertices);
											} else{
												selectedArtVertices = verticesArr;
											}
										} else{
											if (!isShiftDown){
												selectedArtVertices = selectedArtVertices.slice(0, 1);
											}
										}
										
										if (!isMouseDown){
											multipleSelectPos.start = undefined;
											multipleSelectPos.rect = undefined;
										}
									}
									
									disablePolygonEditMovement = (clickedPolygonVertex.type == "vertex");
								} break;
								case "scale": {
									let isShiftDown = (inputs.ShiftLeft || inputs.ShiftRight);
									
									let pos = {
										x: (scaledMousePos.x - entities[1].boxPos.x) / (entities[1].boxPos.w ?? 1),
										y: (scaledMousePos.y - entities[1].boxPos.y) / (entities[1].boxPos.h ?? 1),
									};
									
									if (isMouseDown && clickedButton.i == "" && clickedScrollbar.xy == ""){
										if (multipleMovePos == undefined){
											multipleMovePos = {mousePos: scaledMousePos, startingPos: []};
											
											for (let i in selectedArtVertices){
												multipleMovePos.startingPos[i] = structuredClone(entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num]);
											}
										} else{
											for (let i in selectedArtVertices){
												let arr = entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num];
												let movementPos = {x: multipleMovePos.mousePos.x - scaledMousePos.x, y: multipleMovePos.mousePos.y - scaledMousePos.y};
												
												if (!isShiftDown){
													movementPos.x = 1 - movementPos.x;
													movementPos.y = 1 + movementPos.y;
												} else{
													let ratio = Math.max(Math.abs(movementPos.x), 0.0001) / Math.max(Math.abs(movementPos.y), 0.0001);
													
													if (ratio > 2){
														movementPos.x = 1 - movementPos.x;
														movementPos.y = 1;
													} else if (ratio < 0.5){
														movementPos.x = 1;
														movementPos.y = 1 + movementPos.y;
													} else{
														movementPos.x = 1 + movementPos.y;
														movementPos.y = 1 + movementPos.y;
													}
												}
												
												if (multipleMovePos.startingPos[i] != undefined){
													arr.x = (multipleMovePos.startingPos[i].x - multipleMovePos.mousePos.x) * movementPos.x + multipleMovePos.mousePos.x;
													arr.y = (multipleMovePos.startingPos[i].y - multipleMovePos.mousePos.y) * movementPos.y + multipleMovePos.mousePos.y;
													
													if (multipleMovePos.startingPos[i].front != undefined){
														arr.front.x = (multipleMovePos.startingPos[i].front.x - multipleMovePos.mousePos.x) * movementPos.x + multipleMovePos.mousePos.x;
														arr.front.y = (multipleMovePos.startingPos[i].front.y - multipleMovePos.mousePos.y) * movementPos.y + multipleMovePos.mousePos.y;
													}
													if (multipleMovePos.startingPos[i].back != undefined){
														arr.back.x = (multipleMovePos.startingPos[i].back.x - multipleMovePos.mousePos.x) * movementPos.x + multipleMovePos.mousePos.x;
														arr.back.y = (multipleMovePos.startingPos[i].back.y - multipleMovePos.mousePos.y) * movementPos.y + multipleMovePos.mousePos.y;
													}
												}
											}
										}
									} else{
										multipleMovePos = undefined;
									}
									
									clickedPolygonVertex.i = -1;
								} break;
								case "rotate": {
									let isShiftDown = (inputs.ShiftLeft || inputs.ShiftRight);
									
									let pos = {
										x: (scaledMousePos.x - entities[1].boxPos.x) / (entities[1].boxPos.w ?? 1),
										y: (scaledMousePos.y - entities[1].boxPos.y) / (entities[1].boxPos.h ?? 1),
									};
									
									if (isMouseDown && clickedButton.i == "" && clickedScrollbar.xy == ""){
										if (multipleMovePos == undefined){
											multipleMovePos = {mousePos: scaledMousePos, startingPos: []};
											
											for (let i in selectedArtVertices){
												multipleMovePos.startingPos[i] = structuredClone(entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num]);
											}
										} else{
											for (let i in selectedArtVertices){
												let arr = entities[1].pos.arr[selectedArtVertices[i].layer][selectedArtVertices[i].num];
												let radians = getVertexToVertexRadians(multipleMovePos.mousePos, scaledMousePos) + Math.PI/2;
												
												if (multipleMovePos.mousePos.x == scaledMousePos.x && multipleMovePos.mousePos.y == scaledMousePos.y){
													radians = 0;
												}
												
												if (isShiftDown){
													radians = Math.round(radians / (Math.PI/8)) * (Math.PI/8);
												}
												
												if (multipleMovePos.startingPos[i] != undefined){
													arr.x = getRotatedVertex(multipleMovePos.startingPos[i], radians, multipleMovePos.mousePos).x;
													arr.y = getRotatedVertex(multipleMovePos.startingPos[i], radians, multipleMovePos.mousePos).y;
													
													if (multipleMovePos.startingPos[i].front != undefined){
														arr.front = getRotatedVertex(multipleMovePos.startingPos[i].front, radians, multipleMovePos.mousePos);
													}
													if (multipleMovePos.startingPos[i].back != undefined){
														arr.back = getRotatedVertex(multipleMovePos.startingPos[i].back, radians, multipleMovePos.mousePos);
													}
												}
											}
										}
									} else{
										multipleMovePos = undefined;
									}
									
									clickedPolygonVertex.i = -1;
								} break;
							}
						}>>`],
						
						generateArtButtons: [`<<{
							let instantButtons = [
								[{name: "moveSelectedToEdge", eventName: "moveSelectedToEdge"}, {name: "duplicateSelected", eventName: "duplicateSelectedVertices"}],
								
								[{name: "deleteSelected", eventName: "deleteSelectedVertices"}, {name: "selectEntireLayer", eventName: "selectAllVerticesOfSelectedLayers"}],
								
								[
									{name: "moveSelectedLayersUp", eventName: "moveSelectedLayersUp"},
									{name: "moveSelectedLayersDown", eventName: "moveSelectedLayersDown"},
									{name: "cloneSelectedLayers", eventName: "cloneSelectedLayers"}
								],
								
							];
							
							for (let i = 0; i < drawTool.states.length; i++){
								let name = drawTool.states[i];
								
								
								buttons.art.push({
									pos: {x: 0.035 + (i%3)*0.04, y: 0.175 + Math.floor(i/3)*0.095, w: 0.035, h: 0.07},
									text: "🕴", textSize: 1.1, isAbsolutePositioned: true, title: name, id: name, id2: "toolButtons",
									sprites: [(drawToolSprites[name] ?? "emptyBox")],
									onclick: [{f: "runEval", extraArgs: {text: "drawTool.currentState = '"+name+"';"}}]
								});
							}
							
							for (let i = 0; i < instantButtons.length; i++){
								for (let j = 0; j < instantButtons[i].length; j++){
									buttons.art.push({
										pos: {x: 0.035 + j*0.04, y: 0.175 + 2*0.095 + i*0.095, w: 0.035, h: 0.07},
										text: "🕴", textSize: 1.1, isAbsolutePositioned: true, title: instantButtons[i][j].name,
										sprites: [(drawToolSprites[instantButtons[i][j].name] ?? "emptyBox")],
										onclick: [instantButtons[i][j].eventName],
									});
								}
							}
						}>>`],
					},
				},
				
				buttons: {
					art: [
						{pos: {x: 0.075, y: 0.95, w: 0.1, h: 0.045}, text: "Finish Editing", textSize: 0.125, onclick: ["switchToGame"], isAbsolutePositioned: true},
						
						{pos: {x: 0.055, y: 0.055, w: 0.04, h: 0.04}, isAbsolutePositioned: true, textSize: 0.2, onclick: ["undoArrayUndo"],
						text: "Z ({{Math.max(0, currentUndoNum)}})", title: "Undo", downscaleTextLength: 6},
						{pos: {x: 0.1, y: 0.055, w: 0.04, h: 0.04}, isAbsolutePositioned: true, textSize: 0.2, onclick: ["undoArrayRedo"],
						text: "Y ({{Math.max(0, undoArray.length - currentUndoNum - 1)}})", title: "Redo", downscaleTextLength: 6},
						
						{
							pos: {x: 0.93 - 0.0333/2, y: 0.1, w: 0.0325 * 2, h: 0.045}, isAbsolutePositioned: true,
							text: "Change Line Width", downscaleTextLength: 14,
							textSize: 0.125, onclick: [`<<{
								let text = prompt("(The default size is 0.04, the boundary box has a width of 1)\\n\\nInput A Line Width:");
								
								if (text != null){
									if (!isObject(entities[1].lineWidth)){
										let defaultValue = entities[1].lineWidth;
										entities[1].lineWidth = {};
										
										for (let i in entities[1].pos.arr){
											entities[1].lineWidth[i] = defaultValue;
										}
									}
									
									text = Number(text);
									if (isNumber(text) && text > 0){
										entities[1].lineWidth[selectedArtVertices[0].layer] = text;
									}
								}
							}>>`],
						},
						{
							pos: {x: 0.93 + 0.0333, y: 0.1, w: 0.032, h: 0.045}, isAbsolutePositioned: true,
							text: "Set All", downscaleTextLength: 14,
							textSize: 0.25, onclick: [`<<
								entities[1].lineWidth = entities[1].lineWidth[selectedArtVertices[0].layer] ?? (isObject(entities[1].lineWidth) ? undefined : entities[1].lineWidth) ?? 0.04;
							>>`],
						},
						
						{
							pos: {x: 0.93 - 0.0333/2, y: 0.15, w: 0.0325 * 2, h: 0.045}, isAbsolutePositioned: true,
							text: "Change Color", downscaleTextLength: 14,
							textSize: 0.125, onclick: [`<<{
								let inputText = "Example Colors:\\nCSS Color Name: lightblue, pink\\nRGB Hex Code: #5bcefa, #f5a9b888\\nRGB Text: rgb(92, 205, 250), rgba(245, 168, 184, 0.5)\\nHSL Text: hsl(197, 94%, 67%), hsla(348, 79%, 81%, 0.5)";
								inputText += "\\n\\nCurrent Color: " + (entities[1].color[selectedArtVertices[0].layer] ?? (isObject(entities[1].color) ? undefined : entities[1].color) ?? "#222222");
								inputText += "\\n\\nInput A Color:";
								
								let text = prompt(inputText);
								
								if (text != null && text != ""){
									if (!isObject(entities[1].color)){
										let defaultValue = entities[1].color;
										entities[1].color = {};
										
										for (let i in entities[1].pos.arr){
											entities[1].color[i] = defaultValue;
										}
									}
									entities[1].color[selectedArtVertices[0].layer] = text;
								}
							}>>`],
						},
						{
							pos: {x: 0.93 + 0.0333, y: 0.15, w: 0.032, h: 0.045}, isAbsolutePositioned: true,
							text: "Set All", downscaleTextLength: 14,
							textSize: 0.25, onclick: [`<<
								entities[1].color = entities[1].color[selectedArtVertices[0].layer] ?? (isObject(entities[1].color) ? undefined : entities[1].color) ?? "#222222";
							>>`],
						},
						
						{
							pos: {x: 0.93 - 0.0333, y: 0.2, w: 0.032, h: 0.045}, isAbsolutePositioned: true,
							text: "Hollow", downscaleTextLength: 14,
							textSize: 0.25, onclick: [`<<
								if (!isObject(entities[1].isFill)){
									let defaultValue = entities[1].isFill;
									entities[1].isFill = {};
									
									for (let i in entities[1].pos.arr){
										entities[1].isFill[i] = defaultValue;
									}
								}
								entities[1].isFill[selectedArtVertices[0].layer] = false;
							>>`],
						},
						{
							pos: {x: 0.93, y: 0.2, w: 0.032, h: 0.045}, isAbsolutePositioned: true,
							text: "Filled", downscaleTextLength: 14,
							textSize: 0.25, onclick: [`<<
								if (!isObject(entities[1].isFill)){
									let defaultValue = entities[1].isFill;
									entities[1].isFill = {};
									
									for (let i in entities[1].pos.arr){
										entities[1].isFill[i] = defaultValue;
									}
								}
								entities[1].isFill[selectedArtVertices[0].layer] = true;
							>>`],
						},
						{
							pos: {x: 0.93 + 0.0333, y: 0.2, w: 0.032, h: 0.045}, isAbsolutePositioned: true,
							text: "Set All", downscaleTextLength: 14,
							textSize: 0.25, onclick: [`<<
								entities[1].isFill = entities[1].isFill[selectedArtVertices[0].layer] ?? entities[1].isFill ?? false;
							>>`],
						},
						
						{
							pos: {x: 0.93 - 0.0333/2, y: 0.25, w: 0.0325 * 2, h: 0.045}, isAbsolutePositioned: true,
							text: "Change Outline Color", downscaleTextLength: 14, id: "outlineColorButton",
							textSize: 0.125, onclick: [`<<{
								let inputText = "Example Outline Colors:\\nCSS Color Name: lightblue, pink\\nRGB Hex Code: #5bcefa, #f5a9b888\\nRGB Text: rgb(92, 205, 250), rgba(245, 168, 184, 0.5)\\nHSL Text: hsl(197, 94%, 67%), hsla(348, 79%, 81%, 0.5)";
								inputText += "\\n\\nCurrent Outline Color: " + (
									((entities[1].fillOutline[selectedArtVertices[0].layer] == false) ? "none" : entities[1].fillOutline[selectedArtVertices[0].layer]) ??
									(isObject(entities[1].fillOutline) ? undefined : ((entities[1].fillOutline == false) ? "none" : entities[1].fillOutline)) ?? "none");
								inputText += "\\n(type 'none' to remove the outline)";
								inputText += "\\nInput An Outline Color:";
								
								let text = prompt(inputText);
								
								if (text != null && text != ""){
									if (!isObject(entities[1].fillOutline)){
										let defaultValue = entities[1].fillOutline;
										entities[1].fillOutline = {};
										
										for (let i in entities[1].pos.arr){
											entities[1].fillOutline[i] = defaultValue;
										}
									}
									
									if (text.toLowerCase() == "none"){
										entities[1].fillOutline[selectedArtVertices[0].layer] = false;
									} else{
										entities[1].fillOutline[selectedArtVertices[0].layer] = text;
									}
								}
							}>>`],
						},
						{
							pos: {x: 0.93 + 0.0333, y: 0.25, w: 0.032, h: 0.045}, isAbsolutePositioned: true,
							text: "Set All", downscaleTextLength: 14, id: "outlineColorButton",
							textSize: 0.25, onclick: [`<<
								entities[1].fillOutline = entities[1].fillOutline[selectedArtVertices[0].layer] ?? (isObject(entities[1].fillOutline) ? undefined : entities[1].fillOutline) ?? false;
							>>`],
						},
						
						
						{
							pos: {x: 0.075, y: 0.85, w: 0.1, h: 0.045}, isAbsolutePositioned: true,
							text: "Load Shape", downscaleTextLength: 14,
							textSize: 0.125, onclick: [`<<{
								let textInput = prompt("Shape code:");
								
								if (textInput != null){
									if (gameSprites[textInput] != undefined){
										textInput = stringify(gameSprites[textInput]);
									}
									if (textInput[0] == "{"){
										functionEval("entities[1] = {...entities[1], ..." + textInput + "}");
										
										selectedArtVertices = [{num: -1, layer: Object.keys(entities[1].pos.arr)[0]}];
									}
								}
							}>>`],
						},
						{
							pos: {x: 0.075, y: 0.9, w: 0.1, h: 0.045}, isAbsolutePositioned: true,
							text: "Copy to Clipboard", downscaleTextLength: 14,
							textSize: 0.125, onclick: ["saveCurrentShape", "<<copyTextToClipboard(saveText + ',');>>"],
						},
						{...gamePresets.quitButton}
					],
				},
				
				shouldEditPolygons: false,
				
				entities: [
					{pos: {x: 0, y: -0.035, w: 0.7, h: 1.1, shape: "image", src: undefined}},
					{
						boxPos: {x: 0, y: 0, w: 1, h: 1}, boxRatio: {w: 1, h: 1}, color: "#222222", lineWidth: 0.04, isFill: false, fillOutline: false, isVisible: true,
						showPoints: false, showBox: false, boxColor: "drawBox", isEditable: true, id: "art", shouldCloseShape: true,
						pos: {arr: {layer1: []}, shape: "polygon"}
					},
				],
			},
			createdVariables: {
				selectedArtVertices: [{num: -1, layer: "layer1"}],
				drawTool: {currentState: "createVertex", savedState: "createVertex", states: ["createVertex", "selectAndMove", "changeVertex", "scale", "rotate"]},
				
				drawToolSprites: {
					createVertex: "cursorWithPlusSymbol", selectAndMove: "selectionSymbol", scale: "scalingSymbol", rotate: "rotationSymbol", changeVertex: "vertexTypesSymbol",
					selectEntireLayer: "selectEntireLayerSymbol", duplicateSelected: "duplicateSelectedSymbol",
					deleteSelected: "deleteSelectedSymbol", moveSelectedToEdge: "moveSelectedToEdgeSymbol",
					moveSelectedLayersUp: "upSymbol", moveSelectedLayersDown: "downSymbol", cloneSelectedLayers: "copySymbol"
				},
				
				multipleSelectPos: {start: undefined, rect: undefined},
				multipleMovePos: undefined,
				
				saveText: "",
				undoArray: [],
				currentUndoNum: -1,
				saveKeys: ["pos", "lineWidth", "color", "isFill", "fillOutline", "isVisible"],
				
				findCreatureLevel: 0,
				findCreatureLives: 3,
				
				findTheDifferenceCounts: {stars: 3, trees: 1, left: 3, right: 2, roof: 1, differences: 5},
				findTheDifferenceButtons: [],
				findTheDifferenceLevel: 0,
				findTheDifferenceLives: 3,
				
				fearsArr: [
					"aliven't", "oxygen't", "foodn't", "spacen't", "supportive structuren't", "lightn't",
					"falling", "disappointing", "small things", "big things", "unknown things", "filthy things"
				],
				fearHues: [
					0, 175, 50, 150, 325, 60,
					197, 160, 200, 230, 300, 80
				],
				
				personalityTestPhase: 0,
				personalityValues: {},
				personalityValuesText: "",
				
				relationsChartPhase: 0,
				relationValues: {},
				relationTypes: ["enemy", "jerk", "meanie", "nothing", "acquaintance", "friend", "bestie"],
				relationHues: [20, 27, 35, 0, 85, 95, 115],
				
				digitValue: "",
				digitResults: {"yyy": 5, "yyn": 3, "ynyy": 8, "ynyn": 2, "ynn": 9, "nyy": 1, "nyny": 0, "nynn": 7, "nny": 4, "nnn": 6},
			},
			modifiedVariables: {
				camera: {zoom: {level: 0.18, max: 10}, y: 0.18, areDimentionsEqual: true, minWidthToHeightRatio: 2, ...gamePresets["zoomCamera"]},
				
				gameState: {currentState: "game", states: ["game", "art"]},
				
				colors: {
					backgroundColor: "#575757",
					gameText: "#000000",
					drawBox: {
						pos: {start: {x: 0, y: 0}, end: {x: 0, y: 1}},
						colorStops: [["0", colors.trans[0]], ["0.25", colors.trans[1]], ["0.5", colors.trans[2]], ["0.75", colors.trans[3]], ["1", colors.trans[4]]]
					}
				}
			},
			data: {
				description: "Draw a creature with paths and play some games to figure out their personality!\nThis game is used to draw sprites for other games as well",
				releaseDate: "Late 2025",
				tags: ["path editing", "quiz", "find the difference"],
				videos: [
					{name: "Showcase/Walkthrough Video", value: "https://www.youtube.com/watch?v=LzIyrpJ7T7M"},
				]
			},
		},		
		"Not-So-Quick Save": {
			overriddenVariables: {
				events: {
					onload: [
						{f: "resetButtons", args: {state: "all"}},
						{f: "addButtonsFromButtonsArray", args: {arrName: "menuButtons"}},
						"addOverlayTexts"
					],
					
					addOverlayTexts: [
						{f: "addButtonToOverlay", args: {...gamePresets.channelIconPieceBottomRight, textColor: "#ffffffd4"}},
						{f: "addButtonToOverlay", args: {pos: {x: -0.8, y: 0.4, w: 0.075, h: 0.15},
						text: "Power outage in:\n{{maxButtonClicks - buttonClicks}} clicks",
						textSize: 0.325, disableClick: true, outlineSize: 0.00075, textColor: "powerOutageText", outlineColor: "#00000000", color: "#00000000"}},
					],
					
					refreshCharts: [
						"<<changeButtonArgsById('engineChart', {text: 'Engine Circle Slice [' + charts.engine + '%]'});>>",
						"<<changeButtonArgsById('gameplayChart', {text: 'Gameplay Circle Slice [' + charts.gameplay + '%]'});>>",
						"<<changeButtonArgsById('levelChart', {text: 'Level Design Circle Slice [' + charts.level + '%]'});>>",
						"<<changeButtonArgsById('worldChart', {text: 'World Design Circle Slice [' + charts.world + '%]'});>>",
						"<<changeButtonArgsById('graphicChart', {text: 'Graphic Circle Slice [' + charts.graphic + '%]'});>>",
						
						"<<changeButtonArgsById('tieChart', {isHidden: (charts.gameplay != charts.level || charts.level != 15)});>>",
					],
					
					powerOutageCheck: [
						"<<if (buttonClicks >= maxButtonClicks){ gameState.currentState = 'Fail'; }>>"
					],
					
					resetVariables: [
						`<<{
							buttonToggles = {vSync: false, highNoShadows: false, buttonDNA: false, creditsOptions: false, extras3: false, wonTicTacToe: false, tookCredit: false,
							catalan: true, phonetic: false, potatoRhyme: true, wonChess: false, isLeftControlLeft: true, isRightControlRight: true,
							fishEvolve: false, fishness: false, simplifiedBooks: false, unlockLock: false, buttonAnimation: false, inferentialStats: false};
							
							achievements = {local: "4", global: "9,870,237,264"};
							charts = {engine: 20, gameplay: 20, level: 20, world: 20, graphic: 20};
							sampledPeople = "100";
							inputtedCode = "";
							desertCode = 0;
							
							gender = "Uncustomized Gender";
							pluralGender = "Uncustomized Gendered People";
							
							runEvent("onload");
						}>>`,
					],
					
					onNextFrame: ["powerOutageCheck", "draw"],
				}
			},
			createdVariables: {
				buttonClicks: 0,
				maxButtonClicks: 250,
				
				buttonToggles: {vSync: false, highNoShadows: false, buttonDNA: false, creditsOptions: false, extras3: false, wonTicTacToe: false, tookCredit: false,
				catalan: true, phonetic: false, potatoRhyme: true, wonChess: false, isLeftControlLeft: true, isRightControlRight: true,
				fishEvolve: false, fishness: false, simplifiedBooks: false, unlockLock: false, buttonAnimation: false, inferentialStats: false},
				
				achievements: {local: "4", global: "9,870,237,264"},
				charts: {engine: 20, gameplay: 20, level: 20, world: 20, graphic: 20},
				sampledPeople: "100",
				inputtedCode: "",
				desertCode: 0,
				
				gender: "Uncustomized Gender",
				pluralGender: "Uncustomized Gendered People",
				
				menuButtons: {
					buttons: [
						{value: "Options", buttons: [
							{value: "Graphical Options", buttons: [
								{value: "Vertical Sync", toggle: {value: "vSync"}},
								{value: "Horizontal Sync", toggle: {value: "vSync", isInverse: true}},
								{value: "High-Quality No Shadows", toggle: {value: "highNoShadows"}},
								{value: "Chartical Options", buttons: [
									{value: "Engine Circle Slice [20%]", id: "engineChart", onclick: [
										"<<charts.engine += 10;>>", "<<charts.gameplay -= 5;>>", "<<charts.world -= 5;>>", "refreshCharts"
									]},
									{value: "Gameplay Circle Slice [20%]", id: "gameplayChart", onclick: [
										"<<charts.gameplay += 10;>>", "<<charts.level -= 5;>>", "<<charts.world -= 5;>>", "refreshCharts"
									]},
									{value: "Story/Quest Circle Slice [100%]", isLocked: true},
									{value: "Dialogues Circle Slice [1000%]", isLocked: true},
									{value: "Level Design Circle Slice [20%]", id: "levelChart", onclick: [
										"<<charts.level += 10;>>", "<<charts.engine -= 5;>>", "<<charts.graphic -= 5;>>", "refreshCharts"
									]},
									{value: "AI Circle Slice [?%]", buttons: [
										{label: "Come back once AI takes over the world and adds extra content to this game", text: "Back", isBack: true}
									]},
									{value: "World Design Circle Slice [20%]", id: "worldChart", onclick: [
										"<<charts.world += 10;>>", "<<charts.gameplay -= 5;>>", "<<charts.graphic -= 5;>>", "refreshCharts"
									]},
									{value: "Graphic Circle Slice [20%]", id: "graphicChart", onclick: [
										"<<charts.graphic += 10;>>", "<<charts.engine -= 5;>>", "<<charts.level -= 5;>>", "refreshCharts"
									]},
									{value: "Sound Circle Slice [0%]", isLocked: true},
									{value: "Back", isBack: true},
									{value: "TIE RESOLVER", id: "tieChart", isHidden: true, onclick: [
										"<<charts.gameplay -= 5;>>",
										"<<charts.level += 5;>>",
										"refreshCharts"
									]}
								]}
							]},
							{value: "Reassign Controls", buttons: [
								{text: "Left Control Input: ", toggle: {value: "isLeftControlLeft"}, toggleTexts: {true: "Left Control", false: "Right Control"}},
								{text: "Right Control Input: ", toggle: {value: "isRightControlRight"}, toggleTexts: {true: "Right Control", false: "Left Control"}},
							]},
							{value: "Latency Calibration", buttons: [
								{value: "Click", label: "Click this button exactly when you click this button to calibrate", id: "calibration",
								onclick: "<<changeButtonArgsById('calibrationLabel', {text: 'Latency: 0 kilohertz^-1'});>>"},
							]},
							{value: "Sound Latency Calibration", buttons: [
								{value: "Change Sound Speed", label: "Speed of Sound: 343 m/s", id: "speed", buttons: [
									{label: "Please change your air temperature to change the speed of sound", value: "Back", isBack: true},
								]},
								{value: "Complain about the chosen units", id: "speed",
								onclick: "<<changeButtonArgsById('speedLabel', {text: 'Speed of Sound: 343 (c / 299792458 hertz) hertz'});>>"},
							]},
							{value: "Language Options", buttons: [
								{value: "Catalan Different From Spanish", toggle: {value: "catalan"}},
								{value: "Potato Rhymes With Entire", toggle: {value: "potatoRhyme"}},
								{value: "Simplified Books", toggle: {value: "simplifiedBooks"}},
								{value: "Phonetic English Pronunciation", toggle: {value: "phonetic"}},
								{value: "Rogue Owl On The Loose: On"},
							]},
							{value: "Misc Options", buttons: [
								{text: "Unlock Credits Options", value: "creditsOptionsToggle", id: "creditsToggleId", toggle: {value: "creditsOptions"}, onclick: "<<changeButtonArgsById('creditsOptions', {isLocked: !buttonToggles.creditsOptions});>>"},
							]},
						]},
						{value: "Gameplay Options", buttons: [
							{value: "Is Game Playable: Yes", isLocked: true},
							{value: "Very nice button pressing animation", toggle: {value: "buttonAnimation"}, isLocked: true},
							{value: "No Button DNA", toggle: {value: "buttonDNA", isInverse: true}, isLocked: true},
							{value: "Don't Try Evolving", buttons: [
								{label: "You managed to not try to evolve", text: "Woah", isBack: true},
							]},
							{value: "Unlock Locked House of Unlocked House and Lock House of Locked House", toggle: {value: "unlockLock"}},
						]},
						{value: "Lifework Options", buttons: [
							{value: "Is Life Playable: NO", isLocked: true},
							{value: "Very BAD button pressing animation", toggle: {value: "buttonAnimation", isInverse: true}, isLocked: true},
							{value: "Button DNA", toggle: {value: "buttonDNA"}},
							{value: "Try Evolving", buttons: [
								{label: "Cannot evolve without Button DNA", text: "Succeed At Evolving", id: "evolveId", buttons: [
									{text: "Fishness: ", toggle: {value: "fishness"}, toggleTexts: {true: "Fully Fish", false: "None"}},
								]},
							], onclick: [
								`<<
									if (buttonToggles.buttonDNA){
										if (buttonToggles.fishEvolve){
											changeButtonArgsById('evolveId', {isLocked: false});
											changeButtonArgsById('evolveIdLabel', {text: 'You can evolve into a Fish!'});
										} else{
											changeButtonArgsById('evolveId', {isLocked: true});
											changeButtonArgsById('evolveIdLabel', {text: 'You have no idea what to evolve into'});
										}
									} else{
										changeButtonArgsById('evolveId', {isLocked: true});
										changeButtonArgsById('evolveIdLabel', {text: 'Cannot evolve without Button DNA'});
									}
								>>`
							]},
							{value: "Lock House of Unlocked House and Unlock Locked House of Locked House", toggle: {value: "unlockLock", isInverse: true}},
						]},
						{value: "Achievements", buttons: [
							{value: "Your Achieved ments: ", extraText: "{{achievements.local}}", isLabel: true},
							{value: "Globally Achieved ments: ", extraText: "{{achievements.global}}", isLabel: true},
							{value: "Erase All Achievements (personal computer)", onclick: ["<<achievements.local = '0';>>", "<<achievements.global = achievements.global.slice(0, -1) + '0';>>"]},
							{value: "Erase All Achievements (everyone's computers)", onclick: ["<<achievements.global = '0';>>","<<achievements.local = '0';>>"]}
						]},
						{value: "Statistics", buttons: [
							{value: "Inferential Statistics", buttons: [
								{value: "Example I", buttons: [
									{label: "I sampled 100 people and they were all humans, therefore:", value: "Everything in the Universe is human", id: "sampledPeople", buttons: [
										{label: "Correct, you have now mastered Inferential Statistics Statistical Inference", value: "Yes I know", isFullyBack: true, onclick: "<<buttonToggles.inferentialStats = true;>>"}
									]},
									{value: "Everyone's lying", buttons: [
										{value: "You're so right bestie", isFullyBack: true}
									]},
									{value: "Sample size is too small", onclick: [
										"<<sampledPeople += '0';>>",
										"<<changeButtonArgsById('sampledPeopleLabel', {text: 'I sampled '+sampledPeople+' people and they were all humans, therefore:'});>>",
									]},
								]},
								{value: "Example II", buttons: [
									{label: "Example I was perfect, how dare you ask for another one", value: "It was cherry-picked", buttons: [
										{label: ":O", value: "I see through your lies", buttons: [
											{label: "You're right, I apologize to the harm I caused for the Statistic Wizard(s)", value: "Awesome", isFullyBack: true}
										]},
										{value: "(Stop bullying the poor game)", isFullyBack: true}
									]},
									{value: "I deeply appreciate Example I", buttons: [
										{label: "I sampled 1 person and they liked Example I, therefore:", value: "Everything in the Universe is Example I", buttons: [
											{label: "Yess, you're really good at Inferentials now", value: "Thank you kindly", isFullyBack: true, onclick: "<<buttonToggles.inferentialStats = true;>>"}
										]},
										{value: "That 1 person was awesome", buttons: [
											{label: "Love the confidence, it reflects positively on the entire human population", value: "50%^0", isFullyBack: true}
										]},
									]},
								]},
							]},
							{value: "Descriptive Statistics", buttons: [
								{label: "Our scientist quit due to lack of funding, none of we remaining idiots know about descriptive statistics", text: "Bummer", isBack: true}
							]},
						]},
						{value: "Leaderboards", buttons: [
							{text: "Best Country (By GDP): Country 2", isLabel: true},
							{text: "Best Country (By Education Index): Country 2", isLabel: true},
							{text: "Best Country (By Life Expectancy): Country 2", isLabel: true},
							{text: "Best Country (By Glucose Production): Country 2", isLabel: true},
							{text: "Best Country (By Glucose Exports): Country 2", isLabel: true},
							{text: "Best Country (By Glucose Expenditures): Country 2", isLabel: true},
							{text: "Best Country (By Good Country Index): Country 2", isLabel: true},
							{text: "Best Country (By Not Country 1 Country Index): Country 2", isLabel: true, id: "country1Leaderboards1"},
							{text: "Best Country (By Duo-Books Published): Country 2", isLabel: true},
							{text: "Best Country (By Annual Cannabis Use): Country 2", isLabel: true},
							{text: "Best Country (By Refined Good Country Index Exports): Country 2", isLabel: true},
							{text: "Best Country (By Forest Area): Country 1", isLabel: true, id: "country1Leaderboards2"},
						]},
						{value: "How To Play", buttons: [
							{value: "Button-Clicking Basics 101", buttons: [
								{label: "You can click on a button to click on it. Try it out!", value: "Click me!", buttons: [
									{label: "You can also click the Back button to go back one or more menus towards the main pause main menu", value: "Back", isBack: true}
								]},
								{value: "Donut click me", buttons: [
									{label: "That was a regular click and not a donut click", value: "Potato potato", isBack: true}
								]},
							]},
							{value: "Clicking-Button Advanced 201", buttons: [
								{label: "What would you like to learn about?", value: "Battles of Chess", buttons: [
									{label: "There's no chess in this game", value: "Could you add chess?", buttons: [
										{label: "Yeah sure, visit the Extras", value: "Thanks",
										onclick: "<<changeButtonArgsById('chess', {isLocked: false});>>", isFullyBack: true},
									]}
								]},
								{value: "Shields", buttons: [
									{label: "A shield adds an extra double-time hit to a Skeleton.", value: "shieldsTutorial", text: "Tell me more", buttons: [
										{label: "Yellow Skeletons run away after the first hit, so make sure to finish them off!", text: "Tell me more", buttons: [
											{label: "Black Skeletons take 2 hits before running away.", text: "Tell me more", buttons: [
												{label: "Blademasters are especially tricky. Listen for the SHING sound, then press the corresponding key on the next beat.", text: "Tell me more", buttons: [
													{label: "That's it for this tutorial. Now get out there and crush some monsters!", text: "Thank you Bard", isFullyBack: true}
												]}
											]}
										]}
									]}
								]},
								{value: "How to save", buttons: [
									{label: "Oh, well...", value: "H o w  t o  s a v e", buttons: [
										{label: "I-", value: "H O W  T O  S A V E", buttons: [
											{label: "I DON'T KNOW OKAY????", value: "oh", buttons: [
												{label: "I would suggest asking a wizard, but they might not even exist", value: "Where would they be if they exist?", buttons: [
													{label: "I would say \"Earth\"", value: "Thank you for saying that", isFullyBack: true},
												]},
												{value: "Alright", isFullyBack: true},
											]},
										]},
									]},
								]},
							]},
							{value: "How To Follow Instructions", buttons: [
								{value: "How To Follow Instructions Page 2", label: "Please refer to How To Follow Instructions Page 2", buttons: [
									{value: "How To Follow Instructions Page 1", label: "Please refer to How To Follow Instructions Page 1", onclickGameState: "How To Follow Instructions", savePreviousState: false},
								]},
							]},
							{value: "What To Play", buttons: [
								{label: "Not-So-Quick Save", text: "Now that's a game!", isBack: true},
							]},
						]},
						{value: "Extras", buttons: [
							{value: "Tic Tac Toe", buttons: [
								{label: "Where are you putting your symbol?", text: "Center", buttons: [
									{label: "I put mine to the side. Where are you symboling?", text: "Opposite Side", buttons: [
										{label: "This is going to be a draw", text: "Draw", isFullyBack: true}
									]},
									{text: "Side Side", buttons: [
										{label: "I block your attempt. Where symbol?", text: "Corner Next To Your Symbol", buttons: [
											{label: "This is going to be a draw", text: "Draw", isFullyBack: true}
										]},
										{text: "Corner Next To My Symbol", buttons: [
											{label: "I can't stop your attempt at winning", text: "Win", isFullyBack: true, toggle: {value: "wonTicTacToe", shouldTurnOff: false, hideText: true}}
										]},
										{text: "Side", buttons: [
											{label: "I put mine at the corner with my other symbols and will win", text: "Resign", isFullyBack: true}
										]},
									]},
									{text: "Corner Next To Yours", buttons: [
										{label: "I block your attempt. Where symbol?", text: "Corner Next To Your Symbol", buttons: [
											{label: "This is going to be a draw", text: "Draw", isFullyBack: true}
										]},
										{text: "Corner Next To Nothing", buttons: [
											{label: "I can't stop your attempt at winning", text: "Win", isFullyBack: true, toggle: {value: "wonTicTacToe", shouldTurnOff: false, hideText: true}}
										]},
										{text: "Side Next To My Symbols", buttons: [
											{label: "I can't stop your attempt at winning", text: "Win", isFullyBack: true, toggle: {value: "wonTicTacToe", shouldTurnOff: false, hideText: true}}
										]},
										{text: "Side Not Next To My Corner Symbol", buttons: [
											{label: "This is going to be a draw", text: "Draw", isFullyBack: true}
										]},
									]},
									{text: "Corner Not Next To Yours", buttons: [
										{label: "I block your attempt. Where symbol?", text: "I'll also block your attempt", buttons: [
											{label: "I can't stop your attempt at winning", text: "Win", isFullyBack: true, toggle: {value: "wonTicTacToe", shouldTurnOff: false, hideText: true}}
										]},
										{text: "I won't block your attempt >:(", buttons: [
											{label: "I win", text: "Resign Post-Game", isFullyBack: true}
										]},
									]},
								]},
								{text: "Side", buttons: [
									{label: "I put mine in the center", text: "Resign", isFullyBack: true}
								]},
								{text: "Corner", buttons: [
									{label: "I put mine in the center", text: "Resign", isFullyBack: true}
								]},
							]},
							{value: "Back", isBack: true},
							{value: "Chess (new)", id: "chess", isLocked: true, hideLocked: true, buttons: [
								{label: "How would you like to play?", text: "Poorly", buttons: [
									{label: "I win", text: "Darn", isFullyBack: true}
								]},
								{text: "As best as I can", buttons: [
									{label: "I'm a computer therefore I win", text: "Shucks", isFullyBack: true}
								]},
								{text: "I wanna cheat", buttons: [
									{label: "It's a draw", text: "WHAT", buttons: [
										{label: "Google \"en passant\"", text: "No >:(", buttons: [
											{label: "Okay I did cheat a little on moves 1-8848.5", text: "Typical", isFullyBack: true},
											{text: "Topical", isFullyBack: true},
											{text: "Tropical", isFullyBack: true},
											{text: "Trophical", isFullyBack: true},
											{text: "Can I win then?", buttons: [
												{label: "Yeah sure", text: "Wicked", isFullyBack: true, toggle: {value: "wonChess", shouldTurnOff: false, hideText: true}}
											]},
										]},
										{text: "Can you Google it for me?", onclick: "<<window.open('https://www.google.com/search?q=en+passant')>>"}
									]},
								]},
								{text: "Back", buttons: [
									{label: "Wow okay, I make chess specifically for you and you just leave?", text: "Yiss", isFullyBack: true}
								]},
							]},
						]},
						{value: "Earth Back Extras", text: "Extras II", buttons: [
							{value: "Earth", buttons: [
								{text: "Continent 1", buttons: [
									{text: "Country 1", id: "country1", buttons: [
										{text: "Province 1", buttons: [
											{text: "City 1", buttons: [
												{text: "House 1", buttons: [
													{text: "Computer", buttons: [
														{text: "Folder 1", buttons: [
															{label: "You wish you could unlearn what you saw here", text: "[Unlearn]", buttons: [
																{label: "You have unlearned what you saw here", text: "What was it?", buttons: [
																	{label: "See? It worked", text: "Back", isBack: true},
																]},
															]},
														]},
														{text: "Folder 2", buttons: [
															{text: "Super Secret Password.txt", buttons: [
																{label: "\"First number divisible by 191 and 617 without remainders\"", text: "Secret About The Super Secret Password.innerTXT", buttons: [
																	{text: "(they're primes)", isLocked: true, lockedTitle: "They're really primes."},
																]},
															]},
														]},
													]},
												]},
												{text: "House 2", buttons: [
													{label: "House 2 wishes to be in Country 2 but can't", text: "Why not?", buttons: [
														{label: "Because it's in Country Want, not Country Wish", text: "That's not what it's called", buttons: [
															{label: "Yes it is, check again.", text: "Back", isBack: true},
														], onclick: [
															"<<changeButtonArgsById('country1', {text: 'Country Want'})>>",
															"<<changeButtonArgsById('country1Leaderboards1', {text: 'Best Country (By Not Country Want Country Index): Country 2'})>>",
															"<<changeButtonArgsById('country1Leaderboards2', {text: 'Best Country (By Forest Area): Country Want'})>>",
														]},
													]},
												]},
											]},
											{text: "City 2", buttons: [
												{text: "Shady Hut", buttons: [
													{text: "[Look at Wizard]", buttons: [
														{label: "You see Wizard.", text: "Back", isBack: true}
													]},
													{text: "[Talk to Wizard]", buttons: [
														{text: "[Ask about Shady Hut]", buttons: [
															{label: "\"It is a temporary residence for the big one.\"", text: "Oh okay, I fully understand", isBack: true},
														]},
														{text: "[Ask about Wizardself]", buttons: [
															{label: "\"I am the Curse Wizard, the only wizard for now.\"", text: "For now?", buttons: [
																{label: "\"We are trying our best.\"", text: "Back", isBack: true},
															]},
															{text: "Can I learn more about you?", buttons: [
																{label: "\"I am quite busy now, but I have answered a lot of questions in Cursetris if you are interested.\"",
																text: "[Open Cursetris Right Now]", onclick: "<<window.open('https://soverthe.github.io/Cursetris.html')>>"},
															]},
														]},
														{text: "[Ask about weird menus]", buttons: [
															{label: "\"It might be a commentary on bad menus, or just a contribution perhaps.\"", text: "Um-hum", isBack: true},
														]},
														{text: "[Ask \"How to save\"]", buttons: [
															{label: "\"I was hoping you weren't interested about that.\"", text: "It's why I'm here", buttons: [
																{label: "\"Alright. First of all, Extras IV is the key, but it in itself needs keys.\"", text: "What kind of keys?", buttons: [
																	{label: "\"It accepts multiple passwords that can unlock different things.\"", text: "What are the passwords?", buttons: [
																		{label: "\"That's where the problem begins, I only know the most basic one.\"", text: "And what is it?", buttons: [
																			{label: "\"It's the one that lets you enter Country 2.\"", text: "Okay but what's the code?", buttons: [
																				{label: "\"The number '2'. It stands for 'Country 2'.\"", text: "...That's indeed very basic", buttons: [
																					{label: "\"But make no mistake, Country 2 is the most complex place in town... I mean Earth.\"", text: "What's in it?", buttons: [
																						{label: "\"People there value security to the highest degree, they'll ask a lot from you.\"", text: "Like what?", buttons: [
																							{label: "\"They'll only let you use certain things if they know you can be trusted with them.\"", text: "How can they know that?", buttons: [
																								{label: "\"They might be spying on you at all times and keeping notes about what you do.\"", text: "Thanks for the heads-up", buttons: [
																									{label: "\"No problem, sorry about your upcoming Back presses.\"", text: "Back", isBack: true},
																								]},
																							]},
																						]},
																					]},
																				]},
																			]},
																		]},
																	]},
																]},
															]},
														]},
														{text: "[Let them ask you stuff]", buttons: [
															{label: "What would you like to be asked?", text: "\"Who is your favorite Wizard?\"", onclick: "<<prompt('\"Who is your favorite Wizard?\"')>>", buttons: [
																{label: "\"Classic.\"", text: "Back", isBack: true},
															]},
															{text: "\"What do you think of these menus?\"", onclick: "<<prompt('\"What do you think of these menus?\"')>>", buttons: [
																{label: "\"Understandable.\"", text: "Back", isBack: true},
															]},
															{text: "\"Could you win a fight against a half-sized version of yourself?\"", onclick: "<<prompt('\"Could you win a fight against a half-sized version of yourself?\"')>>", buttons: [
																{label: "\"I thought so.\"", text: "Back", isBack: true},
															]},
															{text: "\"What is your favorite number color?\"", onclick: "<<prompt('\"What is your favorite number color?\"')>>", buttons: [
																{label: "\"I hope that wasn't a lie.\"", text: "Back", isBack: true},
															]},
															{text: "\"Do you like the music?\"", onclick: "<<prompt('\"Do you like the music?\"')>>", buttons: [
																{label: "\"Exactly.\"", text: "Back", isBack: true},
															]},
														]},
													]},
													{text: "[Perception the Wizard]", buttons: [
														{label: "With a high enough roll you would see Wizard, but you rolled too low sadly.", text: "Back", isBack: true}
													]},
													{text: "[Arcana check the Wizard]", buttons: [
														{label: "Arcana Level: Magical", text: "Back", isBack: true}
													]},
												]},
												{text: "Back House", buttons: [
													{label: "(One of these is lying)", text: "Back", isBack: true},
													{text: "Back", isBack: true},
													{text: "Back", isBack: true},
													{text: "Back", isBack: true},
													{text: "Back", isBack: true},
													{text: "Back", buttons: [
														{text: "Shady Hut", buttons: [
															{label: "THIS ISN'T THE SHADY HUT AT ALL, IT'S:", text: "Back House?", buttons: [
																{label: "sí", text: "Awesome", isBack: true},
																{text: "Back", buttons: [
																	{label: "One must not just simply Back House.", text: "Back House Complicatedly", buttons: [
																		{label: "...Oh no.", text: "What's up?", buttons: [
																			{label: "It seems like we stumbled onto a pass-away enigma in Back House. Care to solve it?", text: "Bring it on", buttons: [
																				{label: "I found a bunch of voice recordings, here they are:", text: "Act I: The Nobody", buttons: [
																					{text: "01-BA-0", buttons: [
																						{text: "[@] This is an audio with no people in it just like all the others.", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "[@] As you most definitely know, no one lives in Back House.", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "[@] Fun.", isLabel: true},
																						{text: "", isLabel: true},
																					]},
																					{text: "02-BA-0", buttons: [
																						{text: "[1003] It feels like there are a lot of people in this house.", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "[8213269530] Yeah, I think that there are as well.", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "[@] This is definitely a lie. Very very very very muy muchos interesting................", isLabel: true},
																						{text: "", isLabel: true},
																					]},
																				]},
																				{text: "Act II: Surely No One", buttons: [
																					{text: "03-BA-0", buttons: [
																						{text: "[@] Welcome to the surely no one of Act II!", isLabel: true},
																						{text: "", isLabel: true},
																					]},
																					{text: "04-BA-0", buttons: [
																						{text: "[@] What does BA mean anyways?", isLabel: true},
																						{text: "", isLabel: true},
																					]},
																				]},
																				{text: "Act III: Maybe Someone?", buttons: [
																					{text: "06-BA-0", buttons: [
																						{text: "[@] OKAY! I'm gonna just quickly delete 05-BA-0, that was CRAZY!", isLabel: true},
																						{text: "", isLabel: true},
																					]},
																				]},
																				{text: "Act IV: The Reckoning", buttons: [
																					{label: "There's no reckoning.", text: "Aw.", isBack: true},
																				]},
																			]},
																			{text: "I want to go back", buttons: [
																				{label: "Oh, it's too hard to get back from here? Would you like me to help?", text: "Yes", buttons: [
																					{label: "Click the first button to speed up the inevitable", text: "Click this.", onclick: "<<buttonClicks = 999998 + maxButtonClicks;>>"}
																				]},
																				{text: "No", isBack: true},
																			]},
																		]},
																	]},
																]},
															]},
														]},
														{text: "Back House", buttons: [
															{label: "(You were already in the Back House, check the Shady Hut)", text: "Back", isBack: true},
														]},
													]},
												]},
											]},
										]},
										{text: "Province 2", buttons: [
											{text: "Field 1", buttons: [
												{text: "Tree 1", buttons: [
													{label: "There's a note saying: \"This field (forest) is the pride of the country.\"", text: "Back", isBack: true},
												]},
												{text: "Tree 2", buttons: [
													{label: "There's a note saying: \"Why do we call it a field? You tell me!\"", text: "Back", isBack: true},
												]},
												{text: "Tree 3", buttons: [
													{label: "There's a note saying: \"We are glad to be on the leaderboards, even if only once.\"", text: "Back", isBack: true},
												]},
												{text: "Tree 4", buttons: [
													{label: "There's a note saying: \"At least we're not those security-obsessed freaks...\"", text: "Back", isBack: true},
												]},
												{text: "Tree 5", buttons: [
													{label: "There's a note saying: \"I apologize for my previous note.\"", text: "Back", isBack: true},
												]},
												{text: "Tree 6", buttons: [
													{label: "There's a note saying: \"The people of Country 2 are okay.\"", text: "Back", isBack: true},
												]},
												{text: "Tree 7", buttons: [
													{label: "There's a note saying: \"We do have 12 trees though.\"", text: "Back", isBack: true},
												]},
												{text: "Tree 8", buttons: [
													{label: "There's a note saying: \"Each one one more than the last.\"", text: "Back", isBack: true},
												]},
												{text: "Tree 9", buttons: [
													{label: "There's a note saying: \"...Life is simple here.\"", text: "Back", isBack: true},
												]},
												{text: "Tree 10", buttons: [
													{label: "There's a note saying: \"You just count the trees...\"", text: "Back", isBack: true},
												]},
												{text: "Tree 11", buttons: [
													{label: "There's a note saying: \"Then you become one, I think?\"", text: "Back", isBack: true},
												]},
												{text: "Tree 12", buttons: [
													{label: "There's a note saying: \"I don't fully get this evolution thing.\"", text: "Back", isBack: true},
												]},
											]},
											{text: "Field 2", buttons: [
												{text: "Strange Portal", buttons: [
													{text: "Earth 2", buttons: [
														{text: "Continent -1", buttons: [
															{text: "Country Infinity", buttons: [
																{text: "Province Antivince", buttons: [
																	{text: "Field City 0", buttons: [
																		{text: "Strange Note", buttons: [
																			{text: "Strange Text", buttons: [
																				{label: "You read: \"DO NOT ENTER 46656 AS THE PASSWORD\"", text: "Back", isBack: true},
																			]},
																		]},
																	]},
																]},
															]},
														]},
													]},
												]},
											]},
										]},
									]},
									{text: "Country 2", buttons: [
										{label: "You cannot enter Country 2", text: "Try to enter Country 2", isLocked: true, id: "country2", lockedTitle: "You cannot enter Country 2", buttons: [
											{text: "Commercial District", buttons: [
												{text: "Mall of Everything", buttons: [
													{text: "Library", id: "library", isLocked: true, lockedTitle: "These books are waaay too complicated for you", buttons: [
														{label: "Librarian: \"Welcome to the only library in the Observable Universe! Feel free to read either books.\"", text: "Read Book 1", buttons: [
															{text: "(This book used to be super complicated but has since been simplified)", isLabel: true},
															{text: "", isLabel: true},
															{text: "Bad things = bad", isLabel: true},
															{text: "Good things = debatable", isLabel: true},
															{text: "Batting an eye = batable", isLabel: true},
															{text: "Equals = =", isLabel: true},
															{text: "", isLabel: true},
															{text: "[Return the book]", isBack: true},
														]},
														{text: "Read Book 2", buttons: [
															{text: "Why is there no Book 3?", isLabel: true},
															{text: "", isLabel: true},
															{text: "Why is there no Country 3?", isLabel: true},
															{text: "", isLabel: true},
															{text: "Why is there no Extras 3? Oh wait...", isLabel: true},
															{text: "", isLabel: true},
															{text: "Nevermind that last one, there is an Extras 3,", isLabel: true},
															{text: "it's called Extras III.", isLabel: true},
															{text: "", isLabel: true},
															{text: "[Return the book]", isBack: true},
														]},
													], onclick: ["<<changeButtonArgsById('observableUniverse3', {isLocked: false});>>"]},
													{text: "Sub-Mall of Something?", buttons: [
														{label: "ya shant c dis", id: "somethingMall", text: "Back", isBack: true},
													], onclick: ["<<changeButtonArgsById('somethingMallLabel', {text: 'Here\\'s a free number just for you: ' + getReversedString((Math.random() + '').substring(2))});>>"]},
													{text: "Everything Else", buttons: [
														{text: "Everything (A-B)", buttons: [
															{text: "Apple", buttons: [
																{label: "good pineapple-like food", text: "Back", isBack: true},
															]},
															{text: "Bean", buttons: [
																{label: "the more the merrier foodier", text: "Back", isBack: true},
															]},
															{text: "Bird", buttons: [
																{label: "like a pigeon or worse", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (C-D)", buttons: [
															{text: "Cat", buttons: [
																{label: "curious being with curiosity", text: "Back", isBack: true},
															]},
															{text: "Curiosity", buttons: [
																{label: "cat concept with catosity", text: "Back", isBack: true},
															]},
															{text: "Duck", buttons: [
																{label: "the motion ducks can do while lowering themselves", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (E-F)", buttons: [
															{text: "Everything Else", buttons: [
																{label: "Everything (A-Z)", text: "Back", isBack: true},
															]},
															{text: "Extras", buttons: [
																{label: "a tetralogy without a fifth part", text: "Back", isBack: true},
															]},
															{text: "Frick", buttons: [
																{label: "the protagonist of Undertale", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (G-H)", buttons: [
															{text: "Go To", buttons: [
																{label: "the act of asking someone to go to", text: "Back", isBack: true},
															]},
															{text: "Hell And", buttons: [
																{label: "an alternate name for the Netherlands", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (I-K)", buttons: [
															{text: "J", buttons: [
																{label: "jhe jetter j js jice", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (L-M)", buttons: [
															{text: "Library", buttons: [
																{label: "wait this shouldn't be here?", text: "Back", isBack: true},
															]},
															{text: "Mashing Wachine", buttons: [
																{label: "good for demoving cirt from rlothes", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (N-O)", buttons: [
															{text: "NO", buttons: [
																{label: "x", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (P-R)", buttons: [
															{text: "Pineapple", buttons: [
																{label: "pinnacle apple-like food", text: "Back", isBack: true},
															]},
															{text: "Q", buttons: [
																{label: "pronounced \"queueu\"", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (S-T)", buttons: [
															{text: "Sub-", buttons: [
																{label: "a subfix", text: "Back", isBack: true},
															]},
															{text: "Tetralogy", buttons: [
																{label: "a four-part trilogy without a fifth part", text: "Back", isBack: true},
															]},
															{text: "Trilogy", buttons: [
																{label: "a three-part duology without a fourth part", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (U-V)", buttons: [
															{text: "UniVerse", buttons: [
																{label: "might contain multiple observable parts?", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (W-X)", buttons: [
															{text: "Wise", buttons: [
																{label: "pronounced \"wise\"", text: "Back", isBack: true},
															]},
															{text: "Xebra", buttons: [
																{label: "a stripped being spelled correctly", text: "Back", isBack: true},
															]},
														]},
														{text: "Everything (Y-Z)", buttons: [
															{text: "YZ", buttons: [
																{label: "pronounced \"wise\"", text: "Back", isBack: true},
															]},
														]},
													]},
												]},
												{text: "Mall of Nothing", buttons: [
													{text: "Back", isBack: true},
												]},
											]},
											{text: "Social Status District", buttons: [
												{text: "House of Games", buttons: [
													{text: "Sub-House of Tic Tac Toe Legends", id: "subTicTacToeHouse", isLocked: true, lockedTitle: "You haven't won a game of Tic Tac Toe yet bucko buddy", buttons: [
														{label: "You see a skeleton sitting in a chair. There's nothing more here.", text: "Go up to the skeleton", id: "skel1", buttons: [
															{label: "It's a skeleton alright. Must've been here for a really long time.", text: "Touch the skeleton", id: "skel2", buttons: [
																{label: "The skeleton slowly looks at you and says: \"Did... you... win...\"", text: "I won the Tic Tac Toe", id: "skel3", buttons: [
																	{label: "Tears start to fall out of their eye sockets, then they stand up and leave.", id: "skel4", text: "...", buttons: [
																		{label: "You notice a note on the chair where the skeleton used to be.", text: "Read the note", buttons: [
																			{label: "The note says: \"Thank you for freeing me, I can make more games now. - a Wizard\"", text: "Back", isBack: true},
																		]},
																	], onclick: ["<<changeButtonArgsById('skel4Label', {text: 'One of the best chairs you have seen so far.'});>>"]},
																], onclick: [
																	"<<changeButtonArgsById('skel1Label', {text: 'You see a chair. There\\'s nothing more here.'});>>",
																	"<<changeButtonArgsById('skel1', {text: 'Go up to the chair'});>>",
																	"<<changeButtonArgsById('skel2Label', {text: 'Tis a chair alright.'});>>",
																	"<<changeButtonArgsById('skel2', {text: 'Stare at the chair'});>>",
																	"<<changeButtonArgsById('skel3Label', {text: 'It is a nice chair.'});>>",
																	"<<changeButtonArgsById('skel3', {text: 'Stare more at the chair'});>>",
																	"<<changeButtonArgsById('skelNo1', {text: 'Go away from the chair'});>>",
																	"<<changeButtonArgsById('skelNo2', {text: 'Do NOT stare at the chair'});>>",
																]},
															]},
															{text: "Do NOT touch the skeleton", id: "skelNo2", isBack: true},
														]},
														{text: "Go away from the skeleton", id: "skelNo1", isBack: true},
													]},
													{text: "Sub-House of Chess Cheaters", id: "subChessHouse", isLocked: true, lockedTitle: "You haven't won a cheated game of Chess yet bucko buddy", buttons: [
														{label: "Your account has violated the Lichess Terms of Service.", text: "Aw, not again!", isBack: true},
													], onclick: ["<<changeButtonArgsById('subChessHouse', {text: 'Sub-House of Banned Lichess Accounts'});>>"]},
												]},
												{text: "House of No Games", buttons: [
													{text: "Inferential Sub-House of Statistical Inference", id: "subStatsHouse", isLocked: true, lockedTitle: "You haven't completed the Inferential Statistics course in Statistics", buttons: [
														{text: "Talk to the ex-statistician", buttons: [
															{label: "Exastician: \"I can't believe how low science funding is! I couldn't even finish writing the tutorial.\"", text: "I loved your tutorial!", buttons: [
																{label: "Exastician: \"Oh thanks! I did pretty much all of it, surveying all those people was quite the challenge.\"", text: "What do you do now?", buttons: [
																	{label: "Exastician: \"Haven't had time to think about that yet, but I hope to find another job soon.\"", text: "I wish you the best", buttons: [
																		{label: "Exastician: \"Thanks, at this point I'd work in a dungeon if it had enough probability attached to it.\"", text: "Back", isBack: true},
																	]},
																]},
															]},
															{text: "Could you help me save the game?", buttons: [
																{label: "Exastician: \"Oh that's a tricky one! Don't think it would happen by sheer luck.\"", text: "What are the odds?", buttons: [
																	{label: "Exastician: \"Well at first it's like 1 in 8, but you wouldn't know that it's correct.\"", text: "And then?", buttons: [
																		{label: "Exastician: \"Then it's 1 in 7, assuming you know what you're doing.\"", text: "And then then?", buttons: [
																			{label: "Exastician: \"Overall it's 8! which is 40320. But thankfully it's less than that.\"", text: "How is it less?", buttons: [
																				{label: "Exastician: \"Well you don't have to rely on luck! There are plenty of clues around here.\"", text: "Could you tell me a clue?", buttons: [
																					{label: "Exastician: \"Let's just say that the Credits are usually at the end of games.\"", id: "exasticianCredits", text: "Thanks!", isBack: true},
																				]},
																			]},
																		]},
																	]},
																]},
																{text: "Don't tell me the odds", isBack: true},
															]},
														]},
													]},
													{text: "Sub-House of Math(s) Geniuses", id: "subMathsHouse", isLocked: true, lockedTitle: "You haven't input the math(s) code math(s)ly enough", buttons: [
														{text: "Math(s) Genius 1", buttons: [
															{label: "\"I'm just here to make sure we keep up with the glucose quota.\"", text: "Back", isBack: true},
														]},
														{text: "Math(s) Genius 1+1", buttons: [
															{label: "\"I'm here to click things in alphabetical order based on their last words.\"", text: "How is that math(s)?", buttons: [
																{label: "\"Letters are just fancy numbers.\"", text: "Agree to disagree to agree to disagree", isBack: true},
															]},
														]},
														{text: "Math(s) Genius Cubic Root of 3 Cubed", buttons: [
															{label: "\"AAAAAAAAAAAAAAAAAAAAAAAAAA\"", text: "Hi", buttons: [
																{label: "\"I HAVE SOLVED THE SOLUTION\"", text: "Yeah?", id: "maths3", buttons: [
																	{label: "\"I KNOW HOW TO SAVE THE GAME\"", text: "...Wait, really?", buttons: [
																		{label: "\"YES! YOU JUST GO TO THE DESERT AND...\"", text: "And what?", buttons: [
																			{label: "\"...I CAN'T READ MY HANDWRITING\"", text: "Welp.", isBack: true},
																		]},
																	]},
																]},
																{text: "Aren't solutions already solved?", buttons: [
																	{label: "\"THAT'S NOT WHAT I SAID\"", text: "Sorry I just can't read", isBack: true},
																], onclick: ["<<changeButtonArgsById('maths3Label', {text: 'I HAVE SOLVED THE RIDDLEUTION'});>>"]},
															]},
															{text: "Are you okay?", buttons: [
																{label: "\"Yes I'm swell actually.\"", text: "Oh okay", isBack: true},
															]},
															{text: "Bye", isBack: true},
														]},
													]},
												]},
											]},
											{text: "Transcended Neighborhood", id: "transHood", buttons: [
												{text: "House of Unlocked House", id: "unlockedHouse", isLocked: true, lockedTitle: "Unlocked House is Locked", buttons: [
													{label: "Unlocked House - Warning! Keep it locked! Bad puns ahead!", text: "Basic Puns", buttons: [
														{text: "Paying for a ride is pretty taxi", isLabel: true},
														{text: "I feel like I'm just one person but Spanish people call me tu", isLabel: true},
														{text: "Why do people get buried 6 feet deep? I can't fathom", isLabel: true},
														{text: "I want to sit in a green bodysuit to have greener postures", isLabel: true},
														{text: "I'm the master of disguise, you couldn't find anyone better than me", isLabel: true},
														{text: "I'm losing your mind", isLabel: true},
														{text: "Friend-shaped people have buddy parts", isLabel: true},
													]},
													{text: "Definitely Correct Sayings:", buttons: [
														{text: "Breathing is harder said than done", isLabel: true},
														{text: "You couldn't hurt a fly if it hit you", isLabel: true},
														{text: "Setting up for a recipe of disaster failure", isLabel: true},
														{text: "The brain and the mind are connected", isLabel: true},
														{text: "The journey is the journey", isLabel: true},
														{text: "My lungs are very close to my heart", isLabel: true},
													]},
													{text: "Feels Good to Say(ings):", buttons: [
														{text: "Anime's main enemy is an anemone", isLabel: true},
														{text: "Or ingenious orange genus", isLabel: true},
														{text: "It's a basis to basis casis", isLabel: true},
														{text: "It's a bast from the plast", isLabel: true},
														{text: "The rig was gamed from the start", isLabel: true},
														{text: "Retreat is just rit reet", isLabel: true},
														{text: "I presenta this pasta", isLabel: true},
														{text: "We and me both", isLabel: true},
													]},
													{text: "Special Underworld Puns:", buttons: [
														{text: "Hell you can eat buffet", isLabel: true},
														{text: "Pokdémon", isLabel: true},
														{text: "It's Earth on Hell", isLabel: true},
														{text: "Demon-stration", isLabel: true},
														{text: "I'm very up to Earth", isLabel: true},
														{text: "If you stay in hell for long enough, you'll get demon-itized", buttons: [
															{text: "(I independently came up with this joke and then saw it in the game Purrgatory but I swear I didn't steal it)", isLabel: true},
														]},
														{text: "Reward", buttons: [
															{text: "Thank you for sitting through my puns,", isLabel: true},
															{text: "I'll let you know a hint as a reward.", isLabel: true},
															{text: "", isLabel: true},
															{text: "To save the game, you must go to Continent 2", isLabel: true},
															{text: "then go in the order of 58207x891", isLabel: true},
															{text: "and then you can find the end!", isLabel: true},
															{text: "", isLabel: true},
															{text: "PS: I wrote most of these jokes in 2022,", isLabel: true},
															{text: "if you'd like to complain, go back in time.", isLabel: true},
														]},
													]},
												]},
												{text: "House of Locked House", id: "lockedHouse", isLocked: true, lockedTitle: "Locked House is Locked", buttons: [
													{text: "The Huge Locked In-House Door", buttons: [
														{text: "Open The Huge Locked In-House Door", id: "lockedDoor", isLocked: true, buttons: [
															{text: "Very Open Computer", buttons: [
																{text: "Finished Unpublished Game", buttons: [
																	{text: "Publish Button", buttons: [
																		{text: "Game review", isLabel: true},
																		{text: "The first reviews of our newly released game came in!", isLabel: true},
																		{text: "OK", buttons: [
																			{text: "1 - Really bad. ...Galaxy Works", isLabel: true},
																			{text: "10 - Everyone loves it! ...Clueful Gamer", isLabel: true},
																			{text: "4 - Must have! ...Life Villain", isLabel: true},
																			{text: "11 - UFO/RPG is a terrible combination. ...No Games", isLabel: true},
																			{text: "Close", buttons: [
																				{text: "Industry News", isLabel: true},
																				{text: "We just got word that Alien Skyrim has racked up over 0M in sales!", isLabel: true},
																			]},
																		]},
																	]},
																]},
															]},
														]},
														{text: "Door Keeper", buttons: [
															{label: "Door Keeper: \"Lemme guess, you're wondering about this huge locked door...\"", text: "Yes of course", buttons: [
																{label: "Door Keeper: \"There is a way to unlock this huge locked door actually.\"", text: "What?! No...", buttons: [
																	{label: "Door Keeper: \"Yes no! There's a way.\"", text: "Howww", buttons: [
																		{label: "Door Keeper: \"Some say it has to do with the Chartical Options.\"", text: "What about it?", buttons: [
																			{label: "Door Keeper: \"The changeable charts should go up by 10 or something?\"", text: "...What?", buttons: [
																				{label: "Door Keeper: \"Like from top to bottom it should be: 0 10 20 30 40.\"", text: "That's so obscure.", buttons: [
																					{label: "Door Keeper: \Don't shoot the door keeper!\"", text: "Back", isBack: true},
																				]},
																			]},
																		]},
																	]},
																]},
															]},
															{text: "I wonder about something else", buttons: [
																{label: "Door Keeper: \"Oh really? What are you wondering about?\"", text: "This beautiful door keeper <3", buttons: [
																	{label: "(where this went is up to your imagination)", text: "Back", isBack: true},
																]},
																{text: "This huge locked door", buttons: [
																	{label: "Door Keeper: \"I was just about to guess that!\"", text: "Back", isBack: true},
																]},
															]},
														]},
													], onclick: ["<<changeButtonArgsById('lockedDoor', {isLocked: !(charts.engine == 0 && charts.gameplay == 10 && charts.level == 20 && charts.world == 30 && charts.graphic == 40)});>>"]},
												]},
												{text: "House of Uncustomized Gendered People", id: "genderHouse", isLocked: true, lockedTitle: "Everyone else has customized their genders in the Customize menu", buttons: [
													{label: "This house is full of people!", text: "Person 1", buttons: [
														{label: "\"Hi! Welcome to pluralGender's House! You must be gender, right?\"", id: "genderPerson1", text: "How did you know?", buttons: [
															{label: "\"I used my genderdar and the fact that you're in here\"", id: "genderPerson1b", text: "Back", isBack: true},
														]},
														{text: "You know it!", buttons: [
															{label: "\"Awesome, me too! You're welcome here at any time!\"", text: "Back", isBack: true},
														]},
													]},
													{text: "Person 2", buttons: [
														{label: "\"You know what rhymes with gender?\"", id: "genderPerson2", text: "What?", buttons: [
															{label: "\"I was hoping you'd have some ideas, I'm pretty bad at rhymes sadly.\"", text: "Aw that's okay", buttons: [
																{label: "\"I did come up with a straight joke though, would you like to hear it?\"", text: "Sure, go ahead", buttons: [
																	{text: "\"I'm planning to collect some expensive old horror games and wear them on my head.\"", isLabel: true},
																	{text: "\"I was thinking of calling it the Hat Terror ROM Antique\"", isLabel: true},
																]},
															]},
														]},
													]},
													{text: "Nosrep 3", buttons: [
														{label: "\"ebiv redneg ym s'taht ,sdrawkcab sgniht gnitirw ekil I ,olleH\"", id: "genderPerson3", text: "Awesome", buttons: [
															{label: "\"):\"", text: "Is that a :) or :(?", buttons: [
																{label: "\"): yppah s'tI\"", text: "Oh okay :)", isBack: true},
															]},
														]},
														{text: "Emosewa", buttons: [
															{label: "\"lla uoy evah ot ykcul leef I tub ,semitemos rednik saw dlrow eht hsiw I\"", text: "Me too darling", isBack: true},
														]},
													]},
													{text: "Everyone else", buttons: [
														{label: "Everyone's dancing to some music that you happen to like as well", text: "Join the dance", buttons: [
															{label: "You had an amazing time!", text: ":D", isBack: true},
														]},
														{text: "Social anxiety", isBack: true},
													]},
												], onclick: [
													"<<changeButtonArgsById('genderPerson1Label', {text: '\\\"Hi! Welcome to '+pluralGender+'\\'s House! You must be '+gender.toLowerCase()+', right?\\\"'})>>",
													"<<changeButtonArgsById('genderPerson1bLabel', {text: '\\\"I used my '+gender.replaceAll(' ','').toLowerCase()+'dar and the fact that you\\'re in here\\\"'})>>",
													"<<changeButtonArgsById('genderPerson2Label', {text: '\\\"You know what rhymes with '+gender.toLowerCase()+'?\\\"'})>>",
													"<<changeButtonArgsById('genderPerson3Label', {text: '\\\"ebiv '+gender.toLowerCase().split('').reverse().join('')+' ym s\\'taht ,sdrawkcab sgniht gnitirw ekil I ,olleH\\\"'})>>",
												]},
												{text: "House of Fishness", id: "fishHouse", isLocked: true, lockedTitle: "You're way too not fish for House of Fishness", buttons: [
													{text: "Fish Scientist", buttons: [
														{label: "Scientish: \"You are exactly what I'm looking for!\"", text: "I am?", buttons: [
															{label: "Scientish: \"Yes, you must have recently evolved, right? How did you do it?\"", text: "I typed a heart", buttons: [
																{label: "Scientish: \"Ah, the old 52 trick! I see.\"", text: "Then I clicked Fishness", buttons: [
																	{label: "Scientish: \"Yes, of course. And how was your glucose production?\"", text: "Glucose?", buttons: [
																		{label: "Scientish: \"You know, the thing you make with Thylakoids and all.\"", text: "Ah, right.", isBack: true},
																	]},
																	{text: "I went for a plant build", buttons: [
																		{label: "Scientish: \"Ah of course, photosynthesis! If it ain't broke don't fix it.\"", text: "It's such a broken strategy", buttons: [
																			{label: "Scientish: \"It really is, indeed. Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																		]},
																		{text: "It was difficult though!", buttons: [
																			{label: "Scientish: \"Oh how so? Is there not enough sunlight down there?\"", text: "It's very dark", buttons: [
																				{label: "Scientish: \"Oh I see. Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																			]},
																			{text: "I was fighting for my life!", buttons: [
																				{label: "Scientish: \"Oh wow, I didn't expect that. Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																			]},
																		]},
																	]},
																	{text: "Went all out on Chemosynthesizing Proteins", buttons: [
																		{label: "Scientish: \"Oh really? You found enough Hydrogen Sulfide for that?\"", text: "Yes, I even used Chemoplasts", buttons: [
																			{label: "Scientish: \"That's most interesting! Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																		]},
																		{text: "Yes, but barely", buttons: [
																			{label: "Scientish: \"I see, I see. Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																		]},
																	]},
																	{text: "I just manually ate the glucose", buttons: [
																		{label: "Scientish: \"Oh wow! I didn't know there was that much glucose in the oceans.\"", text: "There's a lot", buttons: [
																			{label: "Scientish: \"That's very convenient! Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																		]},
																		{text: "I ate my fallen siblings", buttons: [
																			{label: "Scientish: \"Oh jeez, nature is brutal. But thanks for your input though, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																		]},
																	]},
																	{text: "Rusticyanin babyyy", buttons: [
																		{label: "Scientish: \"Oh, so there's a lot of iron down there? Did you also use Ferroplasts?\"", text: "Of course I did", buttons: [
																			{label: "Scientish: \"Very interesting! Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																		]},
																		{text: "That would've been too much", buttons: [
																			{label: "Scientish: \"Yes, of course. Thank you so much for your input, now this lab can Thrive!\"", text: "No problem!", isBack: true},
																		]},
																	]},
																	{text: "I don't know", isBack: true},
																]},
																{text: "Wait no", isBack: true},
															]},
															{text: "I forgot", isBack: true},
														]},
														{text: "You got the wrong fish", isBack: true},
													]},
													{text: "I fish out", isBack: true},
												]},
											]},
										], onclick: [
											"<<changeButtonArgsById('library', {isLocked: !buttonToggles.simplifiedBooks});>>",
											"<<changeButtonArgsById('subStatsHouse', {isLocked: !buttonToggles.inferentialStats});>>",
											"<<changeButtonArgsById('subTicTacToeHouse', {isLocked: !buttonToggles.wonTicTacToe});>>",
											"<<changeButtonArgsById('subChessHouse', {isLocked: !buttonToggles.wonChess});>>",
											"<<changeButtonArgsById('unlockedHouse', {isLocked: !buttonToggles.unlockLock});>>",
											"<<changeButtonArgsById('lockedHouse', {isLocked: buttonToggles.unlockLock});>>",
											"<<changeButtonArgsById('genderHouse', {isLocked: pluralGender == 'Uncustomized Gendered People'});>>",
											"<<changeButtonArgsById('fishHouse', {isLocked: !buttonToggles.fishness});>>",
										]},
									]},
								]},
								{text: "Continent 2", buttons: [
									{text: "Desert", buttons: [
										{text: "Cool Dunes", buttons: [
											{label: "Click on a part to get the Part Description (really good)", id: "coolPart", text: "Our Glorious Sand", onclick: [
												"<<changeButtonArgsById('coolPartLabel', {text: 'The gloriousest sand in the more stars than sand on Earth. Some rate it 100/{{desertCode > 1 ? desertCode : 1}}'})>>",
												"<<desertCode = (desertCode == 4 || desertCode == 5) ? 5 : 0;>>"
											]},
											{text: "Our Great Cacti", onclick: [
												"<<changeButtonArgsById('coolPartLabel', {text: 'The greatest cactus (plural) in the Desert (singular). Some rate it 100/{{desertCode > 1 ? desertCode : 1}}'})>>",
												"<<desertCode = 1;>>"
											]},
											{text: "Our Noble Wind", onclick: [
												"<<changeButtonArgsById('coolPartLabel', {text: 'The noblest yes blessed windinwinds of dwwds. Some rate it 100/{{desertCode > 1 ? desertCode : 1}}'})>>",
												"<<desertCode = (desertCode == 7 || desertCode == 8) ? 8 : 0;>>",
												"<<if (desertCode == 8){ changeButtonArgsById('extras3', {isLocked: false}); }>>"
											]},
											{text: "Our Heroic Serpent", onclick: [
												"<<changeButtonArgsById('coolPartLabel', {text: 'The heroicest serpent in the landent. Some rate it 100/{{desertCode > 1 ? desertCode : 1}}'})>>",
												"<<desertCode = (desertCode == 5 || desertCode == 6) ? 6 : 0;>>"
											]},
										]},
										{text: "Lame Dunes", buttons: [
											{label: "Click on a part to get the Part Description (really bad)", id: "lamePart", text: "Their Wicked Gravel", onclick: [
												"<<changeButtonArgsById('lamePartLabel', {text: 'The wickedest graver evel. Some rate it {{desertCode > 1 ? desertCode : 1}}/100'})>>",
												"<<desertCode = (desertCode == 1 || desertCode == 2) ? 2 : 0;>>"
											]},
											{text: "Their Primitive Prick", onclick: [
												"<<changeButtonArgsById('lamePartLabel', {text: 'The primitivest prickest everest. Some rate it {{desertCode > 1 ? desertCode : 1}}/100'})>>",
												"<<desertCode = (desertCode == 3 || desertCode == 4) ? 4 : 0;>>"
											]},
											{text: "Their Backward Gust", onclick: [
												"<<changeButtonArgsById('lamePartLabel', {text: 'The backwardest gust with tsugsid. Some rate it {{desertCode > 1 ? desertCode : 1}}/100'})>>",
												"<<desertCode = (desertCode == 2 || desertCode == 3) ? 3 : 0;>>"
											]},
											{text: "Their Brutish Snake", onclick: [
												"<<changeButtonArgsById('lamePartLabel', {text: 'The brutishest snake of fake Earth. Some rate it {{desertCode > 1 ? desertCode : 1}}/100'})>>",
												"<<desertCode = (desertCode == 6 || desertCode == 7) ? 7 : 0;>>"
											]},
										]},
									]},
									{text: "Lake", buttons: [
										{text: "Lava Lake", buttons: [
											{text: "Lava Fish 1", buttons: [
												{label: "I'm so glad you're here instead of in \"Lava 2+2 2\"", text: "You know me!", buttons: [
													{label: "Although they say that the number you see there is important.", text: "How so?", buttons: [
														{label: "It's like a code or something?", text: "Back", isBack: true},
													]},
												]},
											]},
											{text: "Lava 2+2 2", buttons: [
												{text: "52", buttons: [
													{text: "52 is a heart in case you don't see it", buttons: [
														{text: "Now you're in a lava fish's heart", buttons: [
															{text: "You're filled with 26 times 2 energy", isBack: true},
														]},
													]},
												]},
											]},
										]},
										{text: "Water Lake", isLocked: true, lockedTitle: "The Adventures of FF Island hasn't been beaten yet canonically"},
									]},
								]},
							]},
							{value: "Earth Back", text: "Back", buttons: [
								{value: "Solar System", onclickGameState: "Earth Back Extras"},
								{value: "Earth Back 1", text: "Back", buttons: [
									{value: "Galaxy", onclickGameState: "Earth Back"},
									{value: "Earth Back 2", text: "Back", buttons: [
										{value: "Local Group of Galaxies", onclickGameState: "Earth Back 1"},
										{value: "Earth Back 3", text: "Back", buttons: [
											{value: "Local Supercluster", onclickGameState: "Earth Back 2"},
											{value: "Earth Back 4", text: "Back", buttons: [
												{value: "Observable Universe", onclickGameState: "Earth Back 3"},
												{value: "Earth Back 5", text: "Back", buttons: [
													{value: "Universe", onclickGameState: "Earth Back 4"},
													{value: "I don't want to zoom further", onclickGameState: "menu"},
												]},
												{value: "Observable Universe 3", id: "observableUniverse3", isLocked: true, hideLocked: true, buttons: [
													{text: "Local Supercluster 3", buttons: [
														{text: "Local Group of Galaxies 3", buttons: [
															{text: "Galaxy 3", buttons: [
																{text: "Solar System 3", buttons: [
																	{text: "Earth 3", buttons: [
																		{text: "Continent 3", buttons: [
																			{text: "Country 3", buttons: [
																				{text: "(secret other library)", buttons: [
																					{text: "Read Book 3", buttons: [
																						{text: "Extras III Recipe:", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "Step I:", isLabel: true},
																						{text: "Click the parts of the ----rt in -------tical order.", isLabel: true},
																						{text: "(last words: CAgrguprSASEsnWI)", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "Step II:", isLabel: true},
																						{text: "Check the Credits.", id: "book3credits", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "Step III:", isLabel: true},
																						{text: "", isLabel: true},
																						{text: "[Return the book]", isBack: true},
																					]},
																				]},
																			]},
																		]},
																	]},
																]},
															]},
														]},
													]},
												]},
											]},
										]},
									]},
								]},
							]},
						]},
						{value: "Extras IV", onclick: ["<<inputtedCode = '';>>"], buttons: [
							{value: "0", label: "Code: {{inputtedCode}}", onclick: ["<<inputtedCode += '0';>>"]}, {value: "1", onclick: ["<<inputtedCode += '1';>>"]},
							{value: "2", onclick: ["<<inputtedCode += '2';>>"]}, {value: "3", onclick: ["<<inputtedCode += '3';>>"]},
							{value: "4", onclick: ["<<inputtedCode += '4';>>"]}, {value: "5", onclick: ["<<inputtedCode += '5';>>"]},
							{value: "6", onclick: ["<<inputtedCode += '6';>>"]}, {value: "7", onclick: ["<<inputtedCode += '7';>>"]},
							{value: "8", onclick: ["<<inputtedCode += '8';>>"]}, {value: "9", onclick: ["<<inputtedCode += '9';>>"]},
							{value: "Confirm", onclick: [
								"<<changeButtonArgsById('extras4ConfirmLabel', {text: 'Wrong code :c'});>>",
								"<<changeButtonArgsById('extras4Confirm', {text: 'Aw.'});>>",
								`<<
									if (inputtedCode == '2'){
										changeButtonArgsById('country2', {text: 'Enter Country 2', isLocked: false});
										changeButtonArgsById('country2Label', {text: 'You can now enter Country 2'});
										changeButtonArgsById('extras4ConfirmLabel', {text: 'Access granted for Country 2!'});
										changeButtonArgsById('extras4Confirm', {text: 'Aw, nice!'});
									}
								>>`,
								`<<
									if (inputtedCode == '52'){
										buttonToggles.fishEvolve = true;
										changeButtonArgsById('extras4ConfirmLabel', {text: 'You can now evolve into Fish!'});
										changeButtonArgsById('extras4Confirm', {text: 'Aw, fish! (positive)'});
									}
								>>`,
								`<<
									if (inputtedCode == '117847'){
										changeButtonArgsById('subMathsHouse', {isLocked: false});
										changeButtonArgsById('extras4ConfirmLabel', {text: 'You can now enter that one math(s) house in Country 2!'});
										changeButtonArgsById('extras4Confirm', {text: 'Aw, mathematical! (youth speak of 3025)'});
									}
								>>`,
								`<<
									if (inputtedCode == '46656'){
										changeButtonArgsById('extras4ConfirmLabel', {text: "NOTHING HAPPENS (cuz im evil) hahaha /evil. Also there's no Extras I"});
										changeButtonArgsById('extras4Confirm', {text: 'Aw?'});
									}
								>>`,
								`<<
									if (inputtedCode == '51862437'){
										changeButtonArgsById('extras4ConfirmLabel', {text: "Wrong code, or at least the wrong place for the code, also it's 5186 2437"});
										changeButtonArgsById('extras4Confirm', {text: 'I am so confused'});
									}
								>>`,
								"<<inputtedCode = '';>>",
							], buttons: [
								{label: "You shouldn't see this text.", text: "Got it.", id: "extras4Confirm", isBack: true},
							]},
						]},
						{value: "Customize", buttons: [
							{value: "Extras V", buttons: [
								{label: "There's no Extras V", value: "Thanks", isBack: true}
							]},
							{value: "Gender Customization", buttons: [
								{label: "Which option is the closest to your gender identity?", value: "Feminine", onclick: ["<<gender = 'Feminine';>>"]},
								{value: "Masculine", onclick: ["<<gender = 'Masculine';>>"]},
								{value: "Non-Binary", onclick: ["<<gender = 'Non-Binary';>>"]},
								{value: "Androgynous", onclick: ["<<gender = 'Androgynous';>>"]},
								{value: "Genderfluid", onclick: ["<<gender = 'Genderfluid';>>"]},
								{value: "Bigender", onclick: ["<<gender = 'Bigender';>>"]},
								{value: "Agender", onclick: ["<<gender = 'Agender';>>"]},
								{value: "Demigirl", onclick: ["<<gender = 'Demigirl';>>"]},
								{value: "Demiboy", onclick: ["<<gender = 'Demiboy';>>"]},
								{value: "Xenogender", onclick: ["<<gender = 'Xenogender';>>"]},
								{value: "[Custom]", onclick: ["<<gender = prompt('Please input your gender:');>>"]},
								{value: "Gender Customization Confirm", text: "--> CONFIRM <--",
								onclick: [
									"<<changeButtonArgsById('PluralOption1', {text: gender + ' People', onclick: ['<<pluralGender = \"' + gender + ' People\";>>']})>>",
									"<<changeButtonArgsById('PluralOption2', {text: gender + 's', onclick: ['<<pluralGender = \"' + gender + 's\";>>']})>>",
									"<<changeButtonArgsById('PluralOption3', {text: gender + 'ies', onclick: ['<<pluralGender = \"' + gender + 'ies\";>>']})>>",
									"<<changeButtonArgsById('PluralOption4', {text: gender + 'ers', onclick: ['<<pluralGender = \"' + gender + 'ers\";>>']})>>",
									"<<changeButtonArgsById('PluralOption5', {text: gender + 'ed People', onclick: ['<<pluralGender = \"' + gender + 'ed People\";>>']})>>",
									"<<changeButtonArgsById('PluralOption6', {text: gender + 'ing People', onclick: ['<<pluralGender = \"' + gender + 'ing People\";>>']})>>",
								], buttons: [
									{label: "What's the plural version?", value: "PluralOption1", id: "PluralOption1"},
									{value: "PluralOption2", id: "PluralOption2"},
									{value: "PluralOption3", id: "PluralOption3"},
									{value: "PluralOption4", id: "PluralOption4"},
									{value: "PluralOption5", id: "PluralOption5"},
									{value: "PluralOption6", id: "PluralOption6"},
									{value: "[Custom]", onclick: ["<<pluralGender = prompt('Please input the plural version of your gender:');>>"]},
									{value: "Gender Customization Plural Confirm", text: "--> CONFIRM <--", onclick: [
										"<<changeButtonArgsById('GenderDoneLabel', {text: 'Gender: ' + gender + ', Plural: ' + pluralGender + ', for more info visit Country 2'})>>",
									], buttons: [
										{label: "Gender: Plural: , for more info visit Country 2", value: "Alright!", id: "GenderDone", isFullyBack: true, onclick: [
										"<<changeButtonArgsById('genderHouse', {text: 'House of ' + pluralGender})>>"]},
									]}
								]},
							]},
							{value: "Mod Options", buttons: [
								{label: "The modding community is currently asleep", value: "Back", isBack: true},
							]},
						]},
						{value: "Credits", id: "creditsId", buttons: [
							{label: "Every button was made by Sover the Button Maker", value: "Take credit for it yourself", id: "credits", onclick: ["<<changeButtonArgsById('creditsLabel', {text: 'You made this'});>>", "<<buttonToggles.tookCredit = true;>>"]},
							{value: "Special Thanks", buttons: [
								{label: "", value: "Back", outlineSize: 0, isBack: true},
							]},
							{value: "Back", isBack: true},
							{value: "Credits Options", id: "creditsOptions", isLocked: true, hideLocked: true, buttons: [
								{label: "Would you like Credits to be backwards?", text: "Yes", onclick: [
									"<<changeButtonArgsById('creditsId', {text: 'stiderC'})>>",
									"<<changeButtonArgsById('book3credits', {text: 'Check the stiderC.'})>>",
									"<<changeButtonArgsById('creditsToggleId', {text: 'Unlock stiderC Options'})>>",
									"<<changeButtonArgsById('exasticianCreditsLabel', {text: 'Exastician: \"Let\\'s just say that the stiderC are usually at the end of games.\"'})>>",
								], buttons: [
									{label: "Done. What was the point of this again?", text: "I dunno", isFullyBack: true},
								]},
								{text: "Leave it the way it is", isBack: true},
							]},
							{value: "nothing1", isHidden: true},
							{value: "nothing2", isHidden: true},
							{value: "Extras III", id: "extras3", isLocked: true, hideLocked: true, buttons: [
								{value: "Send Feedback", buttons: [
									{label: "To" + "do: Add Send Feedback Field", value: "Complain about the lack of send feedback field", buttons: [
										{label: "Thank you for your feedback!", value: "Back", isBack: true},
									]},
								]},
								{value: "Quick Save", buttons: [
									{text: "You win!", isLabel: true},
									{text: "You managed to save the game!", isLabel: true},
									{text: "Now you don't have to worry about the whole power thing!", isLabel: true},
									{text: "Awesome!", isLabel: true},
									{text: "", isLabel: true},
									{text: "", isLabel: true},
									{text: "Though it seems like you've forgotten about the whole game by now", isLabel: true},
									{text: "and you can only remember all the buttons from the Pause Menu...", isLabel: true},
									{text: "", isLabel: true},
									{text: "It's probably better this way anyways...", isLabel: true},
									{text: "", isLabel: true},
									{text: "Extras VI", buttons: [
										{text: "Some of the games referenced:", isLabel: true},
										{text: "", isLabel: true},
										{text: "Inspiration for Extras II:", isLabel: true},
										{text: "Nested (by Orteil)", isLabel: true},
										{text: "", isLabel: true},
										{text: "Back House Voice Recordings:", isLabel: true},
										{text: "Type Help (by William Rous)", isLabel: true},
										{text: "", isLabel: true},
										{text: "Chartical Options Slices:", isLabel: true},
										{text: "Game Dev Tycoon (by Greenheart Games)", isLabel: true},
										{text: "", isLabel: true},
										{text: "A LOT of the Menu Buttons:", isLabel: true},
										{text: "Crypt of the Necrodancer (by Brace Yourself Games)", isLabel: true},
										{text: "Extras VII", buttons: [
											{text: "Thank you so much for playing!", isLabel: true},
											{text: "", isLabel: true},
											{text: "Click the " + defaultValues.channelIconPiece + " button to exit the game.", isLabel: true},
										]}
									]},
								], onclick: ["<<saveCurrentGameScore(buttonClicks + 1)>>", "<<buttonClicks = -Infinity;>>"]},
							]},
						]},
						{value: "Legal Notice", buttons: [
							{label: "To" + "do: Add Legal Notice", value: "Complain about the lack of legal notice", buttons: [
								{label: "To" + "do: Add Lack of Legal Notice Complaint Field", value: "Complain about the abundance of lack of legal notice complaint field", buttons: [
									{label: "To" + "do: Add More Complaint Buttons", value: "Back", isFullyBack: true},
								]},
							]},
						]},
						
						{value: "Start", isLocked: true, isHidden: true, buttons: [
							{text: "", isLabel: true, isFullyBack: true},
							{text: "Oh no!", isLabel: true, isFullyBack: true},
							{text: "You got really far in this game,", isLabel: true, isFullyBack: true},
							{text: "but you haven't saved in a long time!", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "Quick, press the Pause Menu button and save your progress", isLabel: true, isFullyBack: true},
							{text: "before your upcoming power outage!", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "(it might take a few tries)", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "Pause Menu", onclick: ["<<buttonClicks = 0;>>", "resetVariables"], isFullyBack: true},
						]},
						{value: "Fail", isLocked: true, isHidden: true, buttons: [
							{text: "", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "Noooooo!!!!", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "Yer power went out before you could save the game :c", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "Would you like to try again?", isLabel: true, isFullyBack: true},
							{text: "", isLabel: true, isFullyBack: true},
							{text: "[Roll back time]", onclick: ["<<buttonClicks = 0;>>", "resetVariables"], isFullyBack: true},
						]},
					],
					buttonArgs: {
						pos: {x: 0, y: -0.425, w: 0.5, h: 0.06, margin: {h: 0.07}},
						onclick: "<<buttonClicks++;>>", downscaleTextLength: 17, textHoverOverlay: true,
						toggleArrName: "buttonToggles", toggleTexts: {true: ": On", false: ": Off"},
						textSize: 0.1, outlineSize: 0.00015, lockedTitleSize: 0.0575
					},
					labelArgs: {
						color: "#00000000", disableClick: true, downscaleTextLength: 50
					},
					args: {
						initialState: "menu",
						backButton: {value: "Back", onclickGameState: "Back", excludedStates: ["menu", "Tic Tac Toe", "Earth Back", "Chess (new)", "Gender Customization", "Quick Save"]}
					}
				},
			},
			modifiedVariables: {
				camera: {zoom: {level: 0.5}, areDimentionsEqual: true, ...gamePresets["lockedCamera"]},
				
				colors: {
					powerOutageText: "#ffffff",
					backgroundColor: {
						pos: {start: {x: 0, y: 0}, end: {x: 1, y: 1}},
						colorStops: [['0', '#3070c8'], ['0.85', '#d2548a']]
					},
					defaultButtonLocked: "#48484866",
				},
				
				gameState: {currentState: "Start", states: ["menu"]},
			},
			data: {
				description: "Navigate your way through extremely complicated menus to save the game!\nOne of my most fun games for people who like some silly jokes :>",
				releaseDate: "Early 2025",
				tags: ["puzzle", "silly jokes", "button game"],
				videos: [
					{name: "Showcase/Walkthrough Video", value: "https://www.youtube.com/watch?v=xErGU3Uo8Fw"},
					{name: '\\"How It Was Made\\" Video', value: "https://www.youtube.com/watch?v=4qr4eq3s6SA"},
				]
			},
		},
		"Countries Quiz": {
			overriddenVariables: {
				drawOrder: ["drawEntities", "drawGrids", "drawButtons", "drawScrollbars"],
				
				events: {
					onload: ["generateGrids", "saveCountryColors", "generateMenuButtons"],
					onNextFrame: ["countryClick", "draw"],
					
					saveCountryColors: [
						"<<for (let i in earthEntity.color){ savedCountryColors[i] = earthEntity.color[i]; }>>"
					],
					refreshActiveCountries: [
						"<<activeCountries = [...activeCountriesArr[getIndexOfInventoryValue({arrName: 'activeCountriesArr', value: currentChallenge})].countries];>>"
					],
					resetCountryColors: [
						"<<for (let i in savedCountryColors){ getEntityById(i).color = savedCountryColors[i]; }>>"
					],
					removeCountryColors: [
						"<<for (let i in savedCountryColors){ getEntityById(i).color = colors.genderfluid[3]; }>>"
					],
					resetCountryColorsForActiveCountries: [
						"removeCountryColors",
						"<<for (let i of activeCountries){ getEntityById(i).color = savedCountryColors[i]; }>>",
						"<<score = {correct: 0, wrong: 0, firstTry: 0};>>"
					],
					
					setStartingCountry: [
						"<<currentCountry = getRandomElementOfArray(activeCountries);>>",
						"<<wrongCountry = '';>>"
					],
					
					resetCameraPosition: [
						"<<continentNum = getIndexOfInventoryValue({arrName: 'continentTeleports', value: currentChallenge});>>",
						"<<camera = {...camera, ...((continentTeleports[continentNum] ?? {}).pos ?? extraTeleports[currentChallenge] ?? extraTeleports['Every Country'])};>>",
						"<<camera.zoom.level = ((continentTeleports[continentNum] ?? {}).pos ?? extraTeleports[currentChallenge] ?? extraTeleports['Every Country']).zoomLevel;>>",
					],
					
					refreshChallenge: ["refreshActiveCountries", "resetCameraPosition", "resetCountryButtons", "resetCountryColorsForActiveCountries", "setStartingCountry"],
					
					
					quitToMenu: [
						"<<gameState.currentState = 'menu';>>",
						"refreshActiveCountries",
						"resetCountryColorsForActiveCountries",
						"<<camera.x = 0;>>",
						"<<camera.y = 0;>>",
						"<<camera.zoom.level = 0.5;>>",
					],
					
					
					resetCountryButtons: [
						`<<buttons.game = [
							{pos: {x: 0.15, y: 0.85, w: 0.15, h: 0.15}, text: "Back", textSize: 0.3, color: "#ffffff44", id: "backButton", isHidden: true, isAbsolutePositioned: true, onclick: "backTeleportClick"},
						]>>`,
						`<<for (let i of activeCountries){
							if (earthCountriesCenter[i] != undefined){
								buttons.game.push({pos: {x: earthCountriesCenter[i].x, y: earthCountriesCenter[i].y, w: 0.005, h: 0.005}, id: i,
								text: "", textSize: 0.3, color: "#00000000", hoverColor: "#ffffff00",
								borderSize: 0.0005, borderColor: savedCountryColors[i],
								onclick: ['<<clickedPolygons[0] = {i: "' + i + '", layer: "0", isDown: false};>>', 'countryClick']});
							}
						}>>`,
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0.21, y: 0.1, w: 0.35, h: 0.075}, isAbsolutePositioned: true,
							text: "{{'Click: ' + ((currentCountry != undefined) ? ((currentChallenge != 'Every Country (facts only)') ? currentCountry : 'Check Fact ->') : 'Done! :>')}}", downscaleTextLength: 30, id: "currentCountry",
							textSize: 0.2/3.5, outlineSize: 0.0025, disableClick: true,
							textColor: colors.white, outlineColor: colors.black, color: "#00000028"
						}},
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0.21, y: 0.175, w: 0.35, h: 0.075}, isAbsolutePositioned: true,
							text: "{{(currentChallenge == 'Tutorial') ? '' : (getNumWithTruncatedDecimals(score.correct / Math.max(score.correct + score.wrong, 1) * 100, 2) + '% (correct: ' + score.correct + ', wrong: ' + score.wrong + ')')}}",
							textSize: 0.175/3.5, outlineSize: 0.0025, disableClick: true,
							textColor: colors.white, outlineColor: colors.black, color: "#00000000"
						}},
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0.21, y: 0.25, w: 0.35, h: 0.075}, isAbsolutePositioned: true,
							text: "{{(wrongCountry != '') ? ('(Clicked: ' + wrongCountry + ')') : ((currentChallenge == 'Tutorial') ? '(wrong guesses appear here and its name above will be colored like the country)' : '')}}",
							textSize: 0.175/3.5, outlineSize: 0.0025, disableClick: true, downscaleTextLength: 42,
							textColor: colors.white, outlineColor: colors.black, color: "#00000000"
						}},
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0.7, y: 0.1, w: 0.6, h: 0.033}, isAbsolutePositioned: true,
							text: "{{(challengeNotes[currentChallenge] ?? {})[(((challengeNotes[currentChallenge] ?? {}).All != undefined) ? 'All' : currentCountry)] ?? earthCountriesNotes[currentCountry] ?? ''}}", downscaleTextLength: 113,
							textSize: 0.0155, outlineSize: 0.00155, disableClick: true,
							textColor: colors.white, outlineColor: colors.black, color: "#00000028"
						}},
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0, y: 0.325, w: 0.2, h: 0.06}, isAbsolutePositioned: false,
							text: "{{(currentChallenge == 'Tutorial') ? 'You can click these to zoom into a continent:' : ''}}",
							textSize: 0.1, outlineSize: 0, disableClick: true, textColor: colors.white, color: "#00000000"
						}},
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0.9645, y: 0.0365, w: 0.04, h: 0.03}, isAbsolutePositioned: true,
							text: "Quit", textSize: 0.3, color: "#ffffffAA", onclick: "quitToMenu"
						}},
						"<<if (camera.zoom.level == 0.5){ runEvent('generateTeleportButtons'); }>>",
					],
					
					
					generateTeleportButtons: [{
						f: "generateButtons", args: {arrName: "continentTeleports", gameState: "game",
						button: {text: "{{value}}", textSize: 0.15, downscaleTextLength: 11,
						subtextPos: {x: 0.325}, textColor: "#000000", outlineColor: "#000000", id: "teleportButton",
						onclick: {event: "teleportClick", args: "{arrName: 'continentTeleports', value: '{{value}}', buttonValue: '{{value}}', index: {{index}}, buttonIndex: {{index}}}"}},
						pos: {x: 0.5, y: 0.4, w: 0.2, h: 0.06, margin: {w: 0.05, h: 0.01}}, grid: {w: 10}, isCentered: true}
					}],
					
					generateMenuButtons: [{
						f: "generateButtons", args: {arrName: "activeCountriesArr", gameState: "menu",
						button: {text: "{{value}}", textColor: "#FFFFFF", color: "#000000AA", borderColor: "menuBorder", borderSize: 0.002, textSize: 0.15, downscaleTextLength: 11,
						onclick: [
							{f: "runEval", extraArgs: {text: "currentChallenge = '{{value}}'"}},
							"refreshActiveCountries",
							"resetCountryColorsForActiveCountries",
						]},
						pos: {x: 0, y: -0.325, w: 0.3, h: 0.1, margin: {w: 0.05, h: 0.01}}, grid: {w: 4}, isCentered: true}
					}],
					
					
					countryClick: [
						`<<
						if ((clickedPolygons[0]??{}).isDown == false){
							let name = clickedPolygons[0].i;
							
							if (activeCountries.includes(name)){
								if (name == currentCountry){
									score.correct++;
									
									if (wrongCountry == ""){
										score.firstTry++;
									}
									
									getEntityById(name).color = colors.genderfluid[3];
									removeValueFromArray({arrName: "activeCountries", value: name});
									
									removeButtonsById(name);
									
									currentCountry = getRandomElementOfArray(activeCountries);
									wrongCountry = "";
									
									changeButtonArgsById("currentCountry", {outlineColor: colors.black, textColor: colors.white});
									
									if (currentCountry == undefined){
										saveCurrentGameScore(score.firstTry);
										
										gameState.currentState = "postGame";
									}
								} else{
									score.wrong++;
									wrongCountry = name;
									
									changeButtonArgsById("currentCountry", {outlineColor: savedCountryColors[currentCountry], textColor: colors.black});
								}
								
								clickedPolygons = [];
							}
						}
						>>`
					],
					
					teleportClick: [
						"<<cancelNextDrawFrame = true;>>",
						"<<camera.x = continentTeleports[args.buttonIndex].pos.x;>>",
						"<<camera.y = continentTeleports[args.buttonIndex].pos.y;>>",
						"<<camera.zoom.level = continentTeleports[args.buttonIndex].pos.zoomLevel;>>",
						"<<changeButtonArgsById('backButton', {isHidden: false})>>",
						"<<changeButtonArgsById('teleportButton', {isHidden: true})>>",
					],
					backTeleportClick: [
						"<<cancelNextDrawFrame = true;>>",
						"<<camera.x = 0;>>",
						"<<camera.y = 0;>>",
						"<<camera.zoom.level = 0.5;>>",
						"<<changeButtonArgsById('backButton', {isHidden: true})>>",
						"<<changeButtonArgsById('teleportButton', {isHidden: false})>>",
					],
					
				},
				
				shouldClickPolygons: true,
				
				buttons: {
					game: [],
					menu: [
						{pos: {x: 0, y: 0.39, w: 0.25, h: 0.085}, text: "Start", textSize: 0.225, color: "#FFFFFFF0", borderColor: "#000000", borderSize: 0.0025, onclick: [
							{f: "runEval", extraArgs: {text: "gameState.currentState = 'game'"}},
							"refreshChallenge"
						]},
						{pos: {x: 0.9645, y: 0.0365, w: 0.04, h: 0.03}, isAbsolutePositioned: true,
							text: "Quit", textSize: 0.3, color: "#ffffffAA", onclick: [{f: "loadGame", args: {gameName: "Game Selection"}}]
						},
					],
					postGame: [
						{pos: {x: 0.5, y: 0.77, w: 0.125, h: 0.075}, text: "Retry", textSize: 0.225, color: "#FFFFFFF0", isAbsolutePositioned: true,
						borderColor: "#000000", borderSize: 0.0025, onclick: [
							"quitToMenu",
							{f: "runEval", extraArgs: {text: "gameState.currentState = 'game'"}},
							"refreshChallenge"
						]},
						{pos: {x: 0.5, y: 0.89, w: 0.125, h: 0.075}, text: "Menu", textSize: 0.225, color: "#FFFFFFF0", isAbsolutePositioned: true,
						borderColor: "#000000", borderSize: 0.0025, onclick: "quitToMenu"},
						
						{pos: {x: 0.5, y: 0.5, w: 0.5, h: 0.3}, isAbsolutePositioned: true,
							text: "{{(currentChallenge == 'Tutorial') ? postTutorialText : 'Done! :>\\n\\nScore:\\n' + (getNumWithTruncatedDecimals(score.correct / Math.max(score.correct + score.wrong, 1) * 100, 2) + '% (correct: ' + score.correct + ', wrong: ' + score.wrong + ')') + '\\n(correct on first try: ' + score.firstTry + ')\\n'}}",
							textSize: 0.175/3.5, marginY: 0.1, outlineSize: 0.0025, downscaleTextLength: 35, disableClick: true,
							textColor: colors.white, outlineColor: colors.black, color: "#00000000"
						},
						
						{pos: {x: 0.5, y: 0.985, w: 0.1, h: 0.1}, text: "thank you", textSize: 0.03, isAbsolutePositioned: true,
						textColor: "#222222", outlineSize: 0, ...gamePresets.textButton},
					]
				},
				entities: [
					...earthEntities,
				]
			},
			createdVariables: {
				savedCountryColors: {},
				
				continentNum: -1,
				currentChallenge: "Every Country",
				activeCountries: [],
				
				disabledCountries: {},
				currentCountry: "",
				wrongCountry: "",
				
				score: {correct: 0, wrong: 0, firstTry: 0},
				
				postTutorialText: "Done! :>\nYou might not get some countries on your first try,\n free to try again until you get all of them!\nYou can also go back to the menu.",
				
				activeCountriesArr: [
					{value: "Tutorial", countries: ["United States", "China", "Brazil", "Russia", "Nigeria", "India", "Australia"]},
					{value: "G20 Countries", countries: ["Argentina", "Australia", "Brazil", "Canada", "China", "France", "Germany", "India", "Indonesia", "Italy", "Japan", "Mexico", "Russia", "Saudi Arabia", "South Africa", "South Korea", "Turkey", "United Kingdom", "United States"]},
					{value: "30 Biggest Countries by Population", countries: earthCountriesOrderOfPopulation.slice(0,30)},
					{value: "10 Biggest European Countries", countries: ["Russia", "Ukraine", "France", "Spain", "Sweden", "Germany", "Finland", "Norway", "Poland", "Italy"]},
					{value: "Balkan Countries", countries: ["Slovenia", "Croatia", "Bosnia and Herzegovina", "Montenegro", "Albania", "Greece", "Serbia", "Kosovo", "North Macedonia", "Romania", "Bulgaria", "Turkey", "Moldova"]},
					{value: "Europe", countries: earthContinents["Europe"]},
					{value: "The Caribbean", countries: ["Cuba", "Jamaica", "Haiti", "Dominican Republic", "The Bahamas", "Dominica", "Trinidad and Tobago", "Saint Lucia", "Saint Vincent and the Grenadines", "Grenada", "Barbados", "Antigua and Barbuda", "Saint Kitts and Nevis"]},
					{value: "North America", countries: earthContinents["North America"]},
					{value: "Spanish-Speaking Countries", countries: ["Mexico", "Guatemala", "United States", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Cuba", "Dominican Republic", "Colombia", "Ecuador", "Peru", "Chile", "Argentina", "Bolivia", "Paraguay", "Uruguay", "Venezuela", "Spain", "Equatorial Guinea"]},
					{value: "South America", countries: [...earthContinents["South America"], "France"]},
					{value: "Asia", countries: earthContinents["Asia"]},
					{value: "Northern Africa", countries: ["Western Sahara", "Mauritania", "Libya", "Tunisia", "Morocco", "Egypt", "Algeria"]},
					{value: "Southern Africa", countries: ["Malawi", "Eswatini", "Lesotho", "South Africa", "Zambia", "Zimbabwe", "Namibia", "Mozambique", "Botswana", "Angola"]},
					{value: "Eastern Africa", countries: ["Comoros", "Mauritius", "Seychelles", "Rwanda", "Uganda", "Kenya", "South Sudan", "Sudan", "Ethiopia", "Eritrea", "Somalia", "Tanzania", "Djibouti", "Madagascar"]},
					{value: "Western Africa", countries: ["Benin", "Burkina Faso", "Côte d'Ivoire", "Guinea-Bissau", "Guinea", "Sierra Leone", "Liberia", "Ghana", "Togo", "Cape Verde", "Nigeria", "Niger", "Mali", "The Gambia", "Senegal"]},
					{value: "Central Africa", countries: ["São Tomé and Príncipe", "Burundi", "Cameroon", "Gabon", "Republic of the Congo", "Central African Republic", "Equatorial Guinea", "Democratic Republic of Congo", "Chad"]},
					{value: "Africa", countries: earthContinents["Africa"]},
					{value: "Commonwealth States", countries: ["United Kingdom", "South Africa", "New Zealand", "Canada", "Australia", "Pakistan", "India", "Sri Lanka", "Ghana", "Malaysia", "Nigeria", "Cyprus", "Sierra Leone", "Tanzania", "Jamaica", "Trinidad and Tobago", "Uganda", "Kenya", "Malawi", "Malta", "Zambia", "The Gambia", "Singapore", "Guyana", "Botswana", "Lesotho", "Barbados", "Mauritius", "Eswatini", "Nauru", "Tonga", "Samoa", "Fiji", "Bangladesh", "The Bahamas", "Grenada", "Papua New Guinea", "Seychelles", "Solomon Islands", "Tuvalu", "Dominica", "Saint Lucia", "Kiribati", "Saint Vincent and the Grenadines", "Vanuatu", "Belize", "Antigua and Barbuda", "Maldives", "Saint Kitts and Nevis", "Brunei", "Namibia", "Cameroon", "Mozambique", "Rwanda", "Togo", "Gabon"]},
					{value: "100 Biggest Countries by Population", countries: earthCountriesOrderOfPopulation.slice(0,100)},
					{value: "Oceania", countries: earthContinents["Oceania"]},
					{value: "Small Countries", countries: earthSmallCountries},
					{value: "100 Smallest Countries by Population", countries: earthCountriesOrderOfPopulation.slice(97,198)},
					{value: "Every Country", countries: [...earthContinents["North America"], ...earthContinents["South America"], ...earthContinents.Europe, ...earthContinents.Africa, ...earthContinents.Asia, ...earthContinents.Oceania]},
					{value: "Every Country (facts only)", countries: [...earthContinents["North America"], ...earthContinents["South America"], ...earthContinents.Europe, ...earthContinents.Africa, ...earthContinents.Asia, ...earthContinents.Oceania]},
				],
				
				continentTeleports: [
					{value: "North America", pos: {x: 0.5043411854926669, y: 0.1658733401713646, zoomLevel: 1.5537469619750979}},
					{value: "South America", pos: {x: 0.39072288450270853, y: -0.15723033386014287, zoomLevel: 1.1337469619750975}},
					{value: "Europe", pos: {x: 0.001378732421038559, y: 0.28797583909289637, zoomLevel: 2.073746961975098}},
					{value: "Africa", pos: {x: -0.03609923088237635, y: -0.01600783135961315, zoomLevel: 1.0737469619750972}},
					{value: "Asia", pos: {x: -0.4713185414856007, y: 0.1391087398199801, zoomLevel: 1.0737469619750972}},
					{value: "Oceania", pos: {x: -0.7710573132698738, y: -0.12417127345614659, zoomLevel: 1.1337469619750973}},
				],
				extraTeleports: {
					"Every Country": {x: 0, y: 0, zoomLevel: 0.5},
					"10 Biggest European Countries": {x: 0.001378732421038559, y: 0.28797583909289637, zoomLevel: 2.073746961975098},
					"Balkan Countries": {x: -0.07252729297197495, y: 0.24166325696500232, zoomLevel: 4.319999999999997},
					"The Caribbean": {x: 0.4834926976374426, y: 0.09993207351613666, zoomLevel: 2.853746961975099},
					"Spanish-Speaking Countries": {x: 0.2600639809850334, y: -0.038727078727078694, zoomLevel: 0.7600000000000002},
					"Northern Africa": {x: 0.02373270873177125, y: 0.14828693979868568, zoomLevel: 2.173746961975098},
					"Southern Africa": {x: -0.0766916558383424, y: -0.13706543268957383, zoomLevel: 1.973746961975098},
					"Eastern Africa": {x: -0.16845188018642146, y: -0.0351615249057599, zoomLevel: 1.5137469619750976},
					"Western Africa": {x: 0.07379206091525109, y: 0.07879342370745435, zoomLevel: 2.013746961975098},
					"Central Africa": {x: -0.04607281908450597, y: 0.012903887756674491, zoomLevel: 1.973746961975098},
				},
				
				challengeNotes: {
					"Spanish-Speaking Countries": {
						"United States": "Counts as Spanish-speaking due to Puerto Rico.",
						"Spain": "The only Spanish-speaking country in Europe. :)",
					},
					"South America": {
						"France": "French Guiana is a region of France located in South America."
					},
					"Tutorial": {
						"All": "(here you can usually read a fact about countries that might help you remember them better)"
					},
				},
			},
			modifiedVariables: {
				camera: {zoom: {level: 0.5, min: 0.02, max: 100}, areDimentionsEqual: true, minWidthToHeightRatio: 2, ...gamePresets["lockedCamera"]},
				
				gameState: {currentState: "menu", states: ["menu", "game", "postGame"]},
				
				colors: {
					backgroundColor: "#808080",
					menuBorder: {
						pos: {start: {x: 0, y: -0.35}, end: {x: 0, y: 0.25}},
						colorStops: [["0", colors.trans[0]], ["0.25", colors.trans[1]], ["0.5", colors.trans[2]], ["0.75", colors.trans[3]], ["1", colors.trans[4]]]
					},
				}
			},
			data: {
				description: "Learn the countries of the world and a fun fact about each of them!",
				releaseDate: "Early 2025",
				tags: ["geography", "countries", "fun facts"],
				videos: [
					{name: "Showcase/Walkthrough Video", value: "https://www.youtube.com/watch?v=HEw7jMk2ggA"},
					{name: '\\"How It Was Made\\" Video', value: "https://www.youtube.com/watch?v=kw94j4VgEPc"},
				]
			},
		},
		"Shape-Shifting Minesweeper": {
			overriddenVariables: {
				events: {
					onload: [],
					onNextFrame: [
						"<<if (checkIfWon){ runEvent('winCheck'); checkIfWon = false;}>>",
						"refreshScrollbars",
						"draw"
					],
					
					refreshScrollbars: [{f: "setScrollbarsToGrids", args: {state: "game", margin: {left: 0.5, right: 0.5, up: 0.5, down: 0.05}}}],
					
					generateNumbers: [
						{f: "incrementGridValuesFromNeighborValues", extraArgs: {gridName: "mainGrid", value: "num", neighborValue: {name: "isBomb", value: true}, layer: "base", shouldReplace: true}}
					],
					
					squareGrid: ["<<mainGrid.data.gridShape = 'rect';>>", "generateNumbers"],
					hexagonGrid: ["<<mainGrid.data.gridShape = 'hex';>>", "generateNumbers"],
					triangleGrid: ["<<mainGrid.data.gridShape = 'tri';>>", "generateNumbers"],
					
					winCheck: [
						"<<uncoveredNum = 0;>>",
						"<<overallBombNum = 0;>>",
						"<<uncoveredBombNum = 0;>>",
						`<<
						for (let i in mainGrid.grid.base){
							for (let j in mainGrid.grid.base[i]){
								if (mainGrid.grid.base[i][j].isBomb){
									overallBombNum++;
								}
								if (mainGrid.grid.base[i][j].isRevealed){
									if (mainGrid.grid.base[i][j].isBomb){
										uncoveredBombNum++;
									} else{
										uncoveredNum++;
									}
								}
							}
						}
						let didWin = (((mainGrid.data.gridSize.w * mainGrid.data.gridSize.h) == (uncoveredNum + overallBombNum)) && bombNum == 0);
						
						if (didWin){
							gameState.currentState = "win";
							
							saveCurrentGameScore(uncoveredBombNum, selectedGridSize);
						}
						>>`
					],
				},
				gridNames: ["mainGrid"],
				buttons: {
					game: [
						{pos: {x: 0.1, y: 0.1, w: 0.1, h: 0.1}, text: "💣: {{bombNum}}", textSize: 0.2, isAbsolutePositioned: true,
						textColor: "#ffffff", outlineSize: 0.0022, ...gamePresets.textButton},
						
						{pos: {x: 0.3, y: 0.1, w: 0.1, h: 0.1}, text: "Square", textSize: 0.2, isAbsolutePositioned: true, onclick: {event: "squareGrid"}},
						{pos: {x: 0.5, y: 0.1, w: 0.1, h: 0.1}, text: "Hexagon", textSize: 0.2, isAbsolutePositioned: true, onclick: {event: "hexagonGrid"}},
						{pos: {x: 0.7, y: 0.1, w: 0.1, h: 0.1}, text: "Triangle", textSize: 0.2, isAbsolutePositioned: true, onclick: {event: "triangleGrid"}},
						
						{pos: {x: 0.95, y: 0.05, w: 0.05, h: 0.05}, text: "Quit", textSize: 0.2, isAbsolutePositioned: true, onclick: "<<(confirm('Are you sure? Your progress will be lost.') ? gameState.currentState = 'menu' : '')>>"},
					],
					menu: [
						{pos: {x: 0.5, y: 0.2, w: 0.4, h: 0.2}, text: "Size Selection", textSize: 0.2, isAbsolutePositioned: true,
						textColor: "#ffffff", outlineSize: 0.005, ...gamePresets.textButton},
						
						{pos: {x: 0.2, y: 0.5, w: 0.2, h: 0.2}, text: "Tiny", textSize: 0.1, isAbsolutePositioned: true, onclick: ["<<mainGrid.data.gridSize = gridSizes.tiny;>>", "<<selectedGridSize = 'Tiny'>>", "generateGrids", "<<gameState.currentState = 'game'>>"]},
						{pos: {x: 0.5, y: 0.5, w: 0.2, h: 0.2}, text: "Medium", textSize: 0.2, isAbsolutePositioned: true, onclick: ["<<mainGrid.data.gridSize = gridSizes.medium;>>", "<<selectedGridSize = 'Medium'>>", "generateGrids", "<<gameState.currentState = 'game'>>"]},
						{pos: {x: 0.8, y: 0.5, w: 0.2, h: 0.2}, text: "Huge", textSize: 0.4, isAbsolutePositioned: true, onclick: ["<<mainGrid.data.gridSize = gridSizes.huge;>>", "<<selectedGridSize = 'Huge'>>", "generateGrids", "<<gameState.currentState = 'game'>>"]},
						
						{pos: {x: 0.5, y: 0.8, w: 0.05, h: 0.05}, text: "MASSIVE", textSize: 3, outlineSize: 0, isAbsolutePositioned: true, textColor: colors.backgroundColor, color: "#ffffff00", textHoverOverlay: true, onclick: ["<<mainGrid.data.gridSize = gridSizes.massive;>>", "<<selectedGridSize = 'Massive'>>", "generateGrids", "<<gameState.currentState = 'game'>>"]},
						
						{pos: {x: 0.95, y: 0.05, w: 0.05, h: 0.05}, text: "Quit", textSize: 0.2, isAbsolutePositioned: true, onclick: [{f: "loadGame", args: {gameName: "Game Selection"}}]},
					],
					win: [
						{pos: {x: 0.5, y: 0.5, w: 0.2, h: 0.2}, text: "You Win!\n\nSize: {{selectedGridSize}}\nExplosions: {{uncoveredBombNum}}", textSize: 0.2, isAbsolutePositioned: true,
						textColor: "#ffffff", outlineSize: 0.005, marginY: 0.1, ...gamePresets.textButton},
						
						{pos: {x: 0.5, y: 0.95, w: 0.1, h: 0.1}, text: "thank you for your contribution", textSize: 0.035, isAbsolutePositioned: true,
						textColor: "#ffffff", outlineSize: 0, ...gamePresets.textButton},
						
						{pos: {x: 0.9, y: 0.1, w: 0.1, h: 0.1}, text: "Menu", textSize: 0.2, isAbsolutePositioned: true, onclick: "<<gameState.currentState = 'menu'>>"},
					],
				},
			},
			createdVariables: {
				bombNum: 0,
				bombRatio: 0.366,
				
				uncoveredNum: 0,
				overallBombNum: 0,
				uncoveredBombNum: 0,
				
				checkIfWon: false,
				
				gridSizes: {tiny: {w: 7, h: 5}, medium: {w: 17, h: 11}, huge: {w: 27, h: 17}, massive: {w: 50, h: 32}},
				selectedGridSize: "Tiny",
				
				mainGrid: {
					grid: {},
					data: {
						x: 0, y: 0, w: 0.2, h: 0.2, gaps: {left: 0, right: 0, up: 0, down: 0}, isCentered: true,
						gridShape: "rect",
						gridSize: {w: 17, h: 11}, layers: ["base"], gameState: "game",
						isFastClick: false,
						
						onload: [
							{f: "setValuesOnGridRandomly", args: {value: {name: "isBomb", value: true}, exclusionPos: [{w: 3, h: 3, isMiddle: true}], amountRatio: "<<bombRatio>>"}},
							{f: "setValuesOnGridPositions", args: {value: {isRevealed: true}, pos: [{w: 3, h: 3, isMiddle: true}], shouldReplace: true}},
							{f: "setVariableToValue", args: {varName: "bombNum", value: {f: "countValuesInGrid", args: {value: {name: "isBomb", value: true}, gridName: "mainGrid"}}}},
							{event: "generateNumbers"},
						],
						
						draw: [
							{f: "fillGridShape", args: {id: "drawTile", color: "#444444", borderColor: "#000000", borderSize: 0.003}},
							{f: "fillGridText", args: {id: "drawLogo", text: defaultValues.channelIconPiece, textSize: 0.45, outlineSize: 0.0005, outlineColor: "#212121"}},
							{f: "fillGridText", args: {id: "drawNumbers", textColor: "#FFFFFF", textSize: 0.4, outlineSize: 0.0025, outlineColor: "#000000", downscaleTextLength: 2}},
						],
						
						gridDrawData: [
							{
								value: {name: "isRevealed", value: true},
								isTrue: [
									{drawTile: {color: "#cecece"}},
									{
										value: {name: "isBomb", value: true},
										isTrue: {drawNumbers: {text: "💣"}, drawTile: {color: "bombColor"}},
										isFalse: {drawNumbers: {value: "num"}}
									}
								],
								isFalse: [
									{drawTile: {color: "#2e2e2e"}},
									{
										value: {name: "isFlagged", value: true},
										isTrue: {drawNumbers: {text: (Math.random() < 0.5 ? "⚑" : "⚐")}},
										isFalse: {value: "<<(args.pos.x + args.pos.y) % 3 == 0>>", isTrue: {drawLogo: {textColor: "#212121"}}},
									},
								]
							}
						],
						gridDrawValues: {},
						
						onclick: [
							{
								value: {name: "mouseButton", value: 1},
								isTrue: {
									value: {name: "isFlagged", value: true},
									isFalse: [
										{
											value: "<<(!args.isRevealed && args.isBomb)>>",
											isTrue: {f: "addValueToVariable", args: {varName: "bombNum", value: -1}}
										},
										{isRevealed: true}
									]
								},
								isFalse: {
									value: {name: "isRevealed", value: true},
									isFalse: {
										value: {name: "isFlagged", value: true},
										isTrue: [
											{isFlagged: false},
											{f: "addValueToVariable", args: {varName: "bombNum", value: 1}}
										],
										isFalse: [
											{isFlagged: true},
											{f: "addValueToVariable", args: {varName: "bombNum", value: -1}}
										]
									}
								}
							},
							"<<checkIfWon = true;>>"
						],
						
						hover: {
							tiles: {}, time: 0.2, clickMultiplier: 1.5, maxHoverAlphaNum: 0.1, fadeInMultiplier: 4, fadeOutMultiplier: 1,
							color: "hsla(0, 100%, 100%, {{alphaNum}})"
						}
					}
				}
			},
			modifiedVariables: {
				camera: {zoom: {level: 0.18}, y: 0.18, areDimentionsEqual: true, minWidthToHeightRatio: 2, ...gamePresets["zoomCamera"]},
				
				gameState: {currentState: "menu", states: ["menu","game","win"]},
				
				colors: {
					bombColor: {
						pos: {start: {x: 0, y: 0}, end: {x: 1, y: 1}},
						colorStops: [["0", colors.bi[0]], ["0.5", colors.bi[1]], ["1", colors.bi[2]]]
					}
				}
			},
			data: {
				description: "Just like the classic Minesweeper,\nbut you toggle the grid between square, hexagon, and triangle tiles.",
				releaseDate: "Early 2025",
				tags: ["minesweeper", "puzzle", "shape-shifting grid"],
				videos: [
					{name: "Showcase/Walkthrough Video", value: "https://www.youtube.com/watch?v=XPUXsrkhAbw"},
					{name: '\\"How It Was Made\\" Video', value: "https://www.youtube.com/watch?v=XfCoa3LBOxs"},
				]
			},
		},
		"''Fascinating'' ''Possibilities''": {
			overriddenVariables: {
				events: {
					onload: [{f: "replaceValuesInArray", args: {arrName: "unlockedButtons"}}, "refreshNumberButtons"],
					onNextFrame: ["draw"],
					
					runNumberFunction: [{f: "runEventOfArrayWithState", extraArgs: {eventArrName: "numberFunctions", stateVarName: "numberTypes"}}],
					
					randomizeNumberType: [{f: "incrementArrayState", extraArgs: {arrName: "numberTypes", value: 1}}],
					
					addLogoText: [
						{f: "addButtonToCurrentGameState", args: gamePresets.channelIconPieceBottomRight},
					],
					
					addTextButtons: [
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0, y: -0.16, w: 0.15, h: 0.05}, text: "Score:\n<<getNumWithTruncatedDecimals(score, 2)>>",
						textSize: 0.15, marginY: 0.2, disableClick: true, outlineSize: 0.00075, textColor: colors.ace[2], outlineColor: colors.ace[0], color: "#00000000"}},
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0, y: -0.095, w: 0.15, h: 0.05}, text: "<<numberTexts[numberTypes.currentState]>>",
						textSize: 0.12, marginY: 0.2, disableClick: true, outlineSize: 0.00075, textColor: "#ffffff", outlineColor: "#000000", color: "#00000000"}},
					],
					addMoveCountText: [
						{f: "addButtonToCurrentGameState", args: {pos: {x: 0.058, y: 1 - 0.05, w: 0.15, h: 0.05}, outlineSize: 0.003, isAbsolutePositioned: true,
						text: "clicks: <<moveCount>>", textSize: 0.1, disableClick: true, textColor: "#ffffff", outlineColor: "#000000", color: "#00000000"}},
					],
					addStateButtons: [
						{f: "addButtonsFromStateArray", args: {arrName: "numberTypes", pos: {x: -0.4175, y: -0.125, w: 0.15, h: 0.03},
						textColor: colors.ace[2], lockedTextColor: colors.ace[0], lockedOutlineColor: colors.ace[0], outlineSize: 0.00015,
						color: colors.ace[3], lockedColor: colors.ace[1],
						textSize: 0.09, offset: {y: 0.04}, disableClick: true, disableClickLooksLocked: true}}
					],
					
					unlockableButtonClick: [
						{f: "setArrayState", extraArgs: {arrName: "numberTypes"}},
						"refreshNumberButtons"
					],
					addUnlockableButtons: ["generateUnlockableButtonsArgs"],
					
					unlockButtons: [
						{f: "changeArrayBooleansByEvalText", args: {arrName: "unlockedButtons", boolName: "value",
						text: "args.currentArr.score != Math.round(score)", shouldTurnOn: false}}
					],
					refreshNumberButtons: [
						"unlockButtons",
						{f: "resetButtons", args: {state: "game"}},
						"<<(!unlockedButtons[5].value && !unlockedButtons[6].value) ? generateUnlockableButtonsArgs.args.pos.margin.h = 0.363 : generateUnlockableButtonsArgs.args.pos.margin.h = Infinity>>",
						"addLogoText",
						"generateButtonsArgs",
						"addTextButtons",
						"addStateButtons",
						"addMoveCountText",
						"addUnlockableButtons"
					],
					
					duplicateButton: [
						{f: "addValueToInventory", extraArgs: {amount: "{{buttonValue}}"}},
						{f: "subtractValueFromVariable", extraArgs: {value: {f: "getArrayMultiple", args: ["{{buttonValue}}",50]}, varName: "score"}}
					],
					
					randomButtons: [
						{f: "addRandomValuesToInventory", extraArgs: {amount: "{{buttonValue}}", min: 1, max: 5}}
					],
					
					mergeButtons: [
						{f: "setVariableToValue", extraArgs: {varName: "mergeScore", value: {f: "getInventoryValueSumWithoutIndex", args: {index: "{{index}}", arrName: "{{arrName}}"}}}},
						"resetArray",
						"addValueToInventory",
						{f: "addValueToInventory", extraArgs: {value: "<<mergeScore>>"}}
					],
					
					moveCountIncrease: [
						{f: "addValueToVariable", extraArgs: {varName: "moveCount", value: 1}},
					],
					
					numberButtonClick: [
						"moveCountIncrease",
						"runNumberFunction",
						"randomizeNumberType",
						"refreshNumberButtons"
					]
				}
			},
			createdVariables: {
				score: 0,
				mergeScore: 0,
				moveCount: 0,
				
				numberTypes: {
					currentState: "add score",
					states: ["add score", "remove button", "divide score", "add score", "negative button"/*, "duplicateButton", "mergeButtons"*/, "random buttons"]
				},
				
				numberTexts: {
					"add score": "Gain score equal to the option number.",
					"remove button": "Choose a button to remove.",
					"divide score": "Divide your score by the option number.",
					"negative button": "Your option becomes negative.",
					"random buttons": "Gain an [option number] amount of random buttons.",
					
					"multiply score": "Multiply your score by the option number.",
					
					"duplicate button": "Duplicate a button the amount of times in the option number.\nLose that much score times 50.",
					"merge buttons": "Select an option. Merge your other options into one option.",
					
					"random value": "Your option becomes a random number between 0 and 1.",
					"square button": "Your option becomes squared.",
					"switch score": "Your [option number] and score switch.",
					"hundred score": "Set your score to [option number] times 100.",
					
					"the end": "You win!\nThank you for contributing to the Wizard Resurrection Initiative."
				},
				
				numberFunctions: {
					"add score": {f: "addValueToVariable", extraArgs: {varName: "score"}},
					"remove button": "removeValueFromInventory",
					"divide score": {f: "divideVariableByValue", extraArgs: {varName: "score"}},
					"negative button": {f: "multipleValueOfInventory", extraArgs: {value: -1}},
					"random buttons": "randomButtons",
					
					"multiply score": {f: "multiplyVariableByValue", extraArgs: {varName: "score"}},
					
					"duplicate button": "duplicateButton",
					"merge buttons": "mergeButtons",
					
					"random value": {f: "changeInventoryValueToEvalText", extraArgs: {text: "getRandomNum({min: 0, max: 1000}) / 1000"}},
					"square button": {f: "exponentiateValueOfInventory", extraArgs: {value: 2}},
					"switch score": {f: "replaceInventoryValueWithVariable", extraArgs: {varName: "score"}},
					"hundred score": {f: "runEval", extraArgs: {text: "window[args.varName] = args.buttonValue * 100;", varName: "score"}},
					
					"the end": [
						"<<saveCurrentGameScore(moveCount)>>",
						"<<alert('victory :>\\n\\nClicks: ' + moveCount);>>"
					]
				},
				
				buttonNumbers: [{value: 1, amount: 1},{value: 3, amount: 1},{value: 4, amount: 1},{value: 5, amount: 1},{value: 6, amount: 1}],
				
				unlockedButtons: [
					{value: true, name: "multiply score", score: "<<getRandomNum({min:7,max:19})>>"},
					{value: true, name: "duplicate button", score: "<<getRandomNum({min:50,max:99})>>"},
					{value: true, name: "merge buttons", score: "<<getRandomNum({max:-250,min:-999})>>"},
					{value: true, name: "random value", score: "<<getRandomNum({max:1000,min:9999})>>"},
					{value: true, name: "square button", score: "<<getRandomNum({min:50000,max:100000})>>"},
					{value: true, name: "switch score", score: "<<getRandomNum({min:5000000,max:10000000})>>"},
					{value: true, name: "hundred score", score: Infinity},
					{value: true, name: "the end", score: "<<getRandomNum({min:50000000000,max:100000000000})>>"}
				],
				
				generateButtonsArgs: {
					f: "generateButtons", args: {arrName: "buttonNumbers", gameState: "game",
					button: {text: "{{value}}", subtext: "x{{amount}}", textSize: 0.3, subtextSize: 0.15, downscaleTextLength: 5, downscaleSubtextLength: 4,
					subtextPos: {x: 0.325}, outlineSize: 0.0002, textColor: "#000000", outlineColor: "#000000",
					onclick: {event: "numberButtonClick", args: "{arrName: 'buttonNumbers', value: {{value}}, buttonValue: {{value}}, index: {{index}}, buttonIndex: {{index}}}"}},
					pos: {x: -0.285, y: -0.025, w: 0.07, h: 0.04, margin: {w: 0.01, h: 0.01}}, grid: {w: 10}}
				},
				
				generateUnlockableButtonsArgs: {
					f: "generateButtons", args: {arrName: "unlockedButtons", gameState: "game",
					button: {text: "{{name}}", lockedText: "{{score}}", textSize: 0.11, outlineSize: 0.0001, color: colors.ace[3], textColor: colors.ace[2], 
					hoverColor: colors.ace[2], maxHoverAlphaNum: 0.5, clickHoverMultiplier: 1.25, hoverReleaseMultiplier: 1.5, lockedColor: colors.ace[1],
					isLocked: "{{value}}", lockedTitle: "[have {{score}} score to unlock]", lockedTitleSize: 0.05,
					onclick: {event: "unlockableButtonClick", args: "{arrName: 'unlockedButtons', value: '{{name}}', buttonValue: '{{name}}', index: {{index}}, buttonIndex: {{index}}}"}},
					pos: {x: -0.41, y: -0.2225, w: 0.125, h: 0.02, margin: {w: 0.01, h: Infinity}}, grid: {w: 7}}
				},
			},
			modifiedVariables: {
				camera: gamePresets["lockedCamera"],
				gameState: {currentState: "game", states: ["game"]},
				
				colors: {
					backgroundColor: {
						pos: {start: {x: 0, y: 0}, end: {x: 1, y: 1}},
						colorStops: [["0", "#787878"], ["1.0", "#585858"]]
					}
				}
			},
			data: {
				description: "A slightly expanded version of Icely puzzle's \"\"\"Interesting\"\" \"\"Choices\"\"\" game.\nReach certain scores by the power of basic mathematics! :>",
				releaseDate: "Early 2025",
				tags: ["math(s)", "puzzle", "button game"],
				videos: [
					{name: "Showcase/Walkthrough Video", value: "https://www.youtube.com/watch?v=qiwD6rdwK6M"},
					{name: '\\"How It Was Made\\" Video', value: "https://www.youtube.com/watch?v=AY1S0kpfKUI"},
				]
			},
		},
		"Knight Patterns": {
			overriddenVariables: {
				drawOrder: ["drawGrids", "drawEntities", "drawButtons", "drawScrollbars"],
				
				inputButtons: {
					startButton: {keyboard: ["Space", "KeyR"], gamepads: [[0],[0],[0],[0]], timer: 0, maxTimer: 0, disableHold: true, onclick: ["startShortcutPress"]},
				},
				
				events: {
					onload: [
						"clearCanvas", "startEvent", "generateGrids", "setPieceGridToPiecePattern", "refreshMenuButtons",
						"generateSpiralGrid", "generateSpiralTilePos", "setupDrawWindowValues"
					],
					
					setupDrawWindowValues: [`<<
						if (gameState.currentState == "draw"){
							canvas.oncontextmenu = null;
							document.getElementById("notesCanvasId").style["pointer-events"] = "none";
							
							shouldConfirmBeforeClosing = false;
							window.onbeforeunload = null;
							
							document.body.style.overflow = "auto";
						}
					>>`],
					onNextFrame: [`<<
						if (gameState.currentState == "draw"){
							runEvent("placePieces");
						} else{
							runEvent("gridNextFrame");
							draw();
						}
					>>`],
					
					
					startEvents: {
						startEvent: [`<<
							let currentURL = new URLSearchParams(location.search);
							let text = currentURL.get('args');
							
							if (text != null){
								gameState.currentState = "draw";
								
								shouldClearCanvas = false;
								
								ctx.fillStyle = "#000000";
								ctx.fillRect(0, 0, canvas.width, canvas.height);
								
								runEvent("loadPiecesFromText", {text: text});
							}
						>>`],
						
						loadPiecesFromText: [`<<{
							pieces = [];
							
							let textArr = args.text.split(";");
							
							for (let i in textArr){
								if (textArr[i][0] == "["){
									let currentArr = textArr[i].split("]");
									pieceOrder = parse(currentArr[0] + "]");
									
									let currentArr2 = currentArr[1].split(",");
									pixelSize = Number(currentArr2[1] ?? 1);
									turnsPerFrame  = Number(currentArr2[2] ?? 10000);
								} else{
									let currentArr = textArr[i].split(",");
									
									let arr = {color: "#"+currentArr[0], previousPos: -1, maxEnemies: Number(currentArr[2] ?? 0), maxAllies: Number(currentArr[3] ?? Infinity)};
									
									let attackPatternText = getTextWithoutLeadingZeros(getBinaryFromHexadecimal(currentArr[1])).slice(1);
									
									let patternSize = Math.floor(Math.sqrt(attackPatternText.length));
									
									arr.attackPattern = [];
									
									for (let j = 0; j < patternSize; j++){
										arr.attackPattern.push(attackPatternText.slice(j * patternSize, (j * patternSize) + patternSize));
									}
									
									pieces.push(arr);
								}
							}
						}>>`],
					},
					
					refreshMenuButtons: [`<<{
						buttons.menu = [
							{pos: {x: 0.35, y: 0.2, w: 0.2, h: 0.06}, text: "Start", textSize: 0.25,
							subtext: "[shortcut: space]", subtextPos: {x: 0, y: 0.4}, onclick: ["startButtonClick"]},
							
							{...gamePresets.quitButton}
						];
						
						/*top piece selection buttons*/
						let currentMiddlePos = {x: -0.145, y: -0.15, w: 0.25, h: 0.15};
						let currentLength = pieces.length + 1;
						let currentGridSize = {w: Math.max(Math.ceil(Math.sqrt(currentLength)), 3), h: Math.max(Math.ceil(Math.sqrt(currentLength)), 3)};
						for (let i = 0; i < pieces.length + 1; i++){
							let currentPos = {
								x: currentMiddlePos.x + ((i % currentGridSize.w) / currentGridSize.w) * currentMiddlePos.w - currentMiddlePos.w/2,
								y: currentMiddlePos.y + (Math.floor(i / currentGridSize.h) / currentGridSize.h) * currentMiddlePos.h - currentMiddlePos.h/2,
								w: currentMiddlePos.w / currentGridSize.w,
								h: currentMiddlePos.h / currentGridSize.h - 0.015
							};
							if (i < pieces.length){
								buttons.menu.push({
									pos: currentPos, text: i, textSize: 0.4, downscaleTextLength: 2, color: pieces[i].color, isCentered: false,
									onclick: ["<<selectedPieceNum = "+i+";>>", "setPieceGridToPiecePattern", "refreshMenuButtons"],
								});
								buttons.menu.push({
									pos: {x: currentPos.x, y: currentPos.y + currentMiddlePos.h / currentGridSize.h - 0.015, w: currentPos.w, h: 0.015},
									text: "delete", textSize: 0.15, color: pieces[i].color, isCentered: false,
									onclick: ["<<runEvent('removePiece', {i:"+i+"})>>", "setPieceGridToPiecePattern", "refreshMenuButtons"],
								});
							} else{
								buttons.menu.push({
									pos: {x: currentPos.x, y: currentPos.y, w: currentPos.w, h: currentPos.h + 0.015},
									text: "+", textSize: 1, isCentered: false, onclick: ["addPiece", "setPieceGridToPiecePattern", "refreshMenuButtons"],
								});
							}
						}
						
						/*top grid buttons*/
						currentMiddlePos = {x: 0.0875 - 0.025, y: -0.166- 0.05, w: 0.0325, h: 0.02};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y + (currentMiddlePos.h+0.005)/2 + 0.025*0, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "+", textSize: 1, onclick: ["increaseGridSize"]
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y + (currentMiddlePos.h+0.005)/2 + 0.025*1, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "-", textSize: 1, onclick: ["decreaseGridSize"]
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y + (currentMiddlePos.h+0.005)/2 + 0.025*2, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "clear", textSize: 0.35, onclick: ["clearGrid"]
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y + (currentMiddlePos.h+0.005)/2 + 0.025*3, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "reset", textSize: 0.35, onclick: ["resetGrid"]
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y + (currentMiddlePos.h+0.005)/2 + 0.025*4, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "random", textSize: 0.3, onclick: ["randomizeGrid"]
						});
						
						/*top color buttons*/
						for (let i = 0; i < defaultColors.length + 1; i++){
							for (let j = 0; j < (defaultColors[i]?.length ?? (customColors.length + 1)); j++){
								let currentPos = {
									x: -0.475 + j * 0.03,
									y: -0.225 + i * 0.025,
									w: 0.025,
									h: 0.02
								};
								
								if (i < defaultColors.length){
									buttons.menu.push({
										pos: currentPos, isCentered: false, color: defaultColors[i][j],
										onclick: ["<<pieces[selectedPieceNum].color = '"+defaultColors[i][j]+"';>>", "refreshMenuButtons"],
									});
								} else{
									if (j == 0){
										buttons.menu.push({
											pos: currentPos, text: "+", textSize: 1, isCentered: false,
											onclick: ["<<let color = prompt('Input a color by its hex code (eg: #f5a9b8)'); if ((color ?? '')[0] == '#'){customColors.unshift(color)}>>",
											"<<customColors = customColors.slice(0, 4);>>", "refreshMenuButtons"],
										});
									} else{
										buttons.menu.push({
											pos: currentPos, isCentered: false, color: customColors[j - 1],
											onclick: ["<<pieces[selectedPieceNum].color = '"+customColors[j - 1]+"';>>", "refreshMenuButtons"],
										});
									}
								}
							}
						}
						
						/*top max enemies allies buttons*/
						currentMiddlePos = {x: 0.35, y: -0.225, w: 0.2, h: 0.1};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h}, color: "#00000000",
							text: "max enemies", textColor: pieces[selectedPieceNum].color, disableClick: true,
						});
						currentMiddlePos = {x: currentMiddlePos.x, y: currentMiddlePos.y + 0.03, w: 0.03, h: 0.03};
						let currentText = (pieces[selectedPieceNum].maxEnemies == Infinity) ? "∞" : pieces[selectedPieceNum].maxEnemies;
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - 0.07, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "{{defaultValues.doubleLessThan}}", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'enemies', changeType: 0})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - 0.035, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "<", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'enemies', changeType: -1})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: currentText, textSize: 0.4, downscaleTextLength: 2, textColor: pieces[selectedPieceNum].color, disableClick: true,
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + 0.035, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: ">", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'enemies', changeType: 1})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + 0.07, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "{{defaultValues.doubleMoreThan}}", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'enemies', changeType: Infinity})>>", "refreshMenuButtons"],
						});
						currentMiddlePos = {x: currentMiddlePos.x, y: currentMiddlePos.y + 0.05, w: 0.2, h: 0.1};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h}, color: "#00000000",
							text: "max allies", textColor: pieces[selectedPieceNum].color, disableClick: true,
						});
						currentMiddlePos = {x: currentMiddlePos.x, y: currentMiddlePos.y + 0.03, w: 0.03, h: 0.03};
						currentText = (pieces[selectedPieceNum].maxAllies == Infinity) ? "∞" : pieces[selectedPieceNum].maxAllies;
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - 0.07, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "{{defaultValues.doubleLessThan}}", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'allies', changeType: 0})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - 0.035, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "<", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'allies', changeType: -1})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: currentText, textSize: 0.4, downscaleTextLength: 2, textColor: pieces[selectedPieceNum].color, disableClick: true,
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + 0.035, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: ">", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'allies', changeType: 1})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + 0.07, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "{{defaultValues.doubleMoreThan}}", textSize: 0.4, textColor: pieces[selectedPieceNum].color,
							onclick: ["<<runEvent('changeMaxAttackerValues', {type: 'allies', changeType: Infinity})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y + 0.025, w: currentMiddlePos.w * 1.25, h: currentMiddlePos.h * 0.35},
							text: "random", textSize: 0.25, textColor: pieces[selectedPieceNum].color,
							onclick: ["randomizeMaxAttackers", "refreshMenuButtons"],
						});
						
						/*middle row piece order buttons*/
						currentMiddlePos = {x: 0, y: -0.1/2, w: 1, h: 0.1};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y + currentMiddlePos.h/2 - currentMiddlePos.h * 0.05,
							w: currentMiddlePos.w * 1.1, h: currentMiddlePos.h * 1.25},
							text: "", textSize: 0.03, color: "#ffffff18", disableClick: true,
						});
						buttons.menu.push({
							pos: {x: -0.45, y: currentMiddlePos.y - currentMiddlePos.h * 0.085,
							w: 0.1, h: currentMiddlePos.h * 0.1},
							text: "turn order:", textSize: 0.15, color: "#ffffff00", disableClick: true,
						});
						
						buttons.menu.push({
							pos: {x: -0.37, y: currentMiddlePos.y - currentMiddlePos.h * 0.085,
							w: 0.05, h: 0.01},
							text: "random", textSize: 0.2, onclick: ["randomizePieceOrder", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: -0.307, y: currentMiddlePos.y - currentMiddlePos.h * 0.085,
							w: 0.05, h: 0.01},
							text: "reset", textSize: 0.2, onclick: ["resetPieceOrder", "refreshMenuButtons"],
						});
						
						currentLength = pieceOrder.length + 1;
						for (let i = 0; i < pieceOrder.length + 1; i++){
							let currentPos = {
								x: currentMiddlePos.x + (i / (pieceOrder.length + 1)) * currentMiddlePos.w - currentMiddlePos.w/2,
								y: currentMiddlePos.y,
								w: (currentMiddlePos.w / (pieceOrder.length + 1)) * 0.95,
								h: currentMiddlePos.h - 0.01
							};
							
							currentPos.w = Math.min(currentPos.w, 0.3);
							
							if (i < pieceOrder.length){
								buttons.menu.push({
									pos: currentPos, text: "", textSize: 0.4, downscaleTextLength: 2, color: pieces[pieceOrder[i]].color, isCentered: false,
									disableClick: true,
								});
								buttons.menu.push({
									pos: {x: currentPos.x, y: currentPos.y + currentMiddlePos.h - 0.01, w: currentPos.w, h: 0.01},
									text: "delete", textSize: 0.03, color: pieces[pieceOrder[i]].color, isCentered: false,
									onclick: ["<<runEvent('removePieceOrderIndex', {i:"+i+"})>>", "refreshMenuButtons"],
								});
								
								
								let currentOuterPos = {
									x: currentPos.x + 0.002,
									y: currentPos.y + 0.005,
									w: currentPos.w - 0.004,
									h: currentPos.h - 0.03,
								};
								
								buttons.menu.push({
									pos: {x: currentOuterPos.x, y: currentOuterPos.y + currentOuterPos.h * 1.05, w: currentOuterPos.w/2, h: 0.02},
									text: "<", textSize: 0.1, color: pieces[pieceOrder[i]].color, borderColor: "#000000", borderSize: 0.001, isCentered: false,
									onclick: ["<<runEvent('movePieceOrderIndex', {i:"+i+", increment: -1})>>", "setPieceGridToPiecePattern", "refreshMenuButtons"],
								});
								buttons.menu.push({
									pos: {x: currentOuterPos.x + currentOuterPos.w/2, y: currentOuterPos.y + currentOuterPos.h * 1.05, w: currentOuterPos.w/2, h: 0.02},
									text: ">", textSize: 0.1, color: pieces[pieceOrder[i]].color, borderColor: "#000000", borderSize: 0.001, isCentered: false,
									onclick: ["<<runEvent('movePieceOrderIndex', {i:"+i+", increment: 1})>>", "setPieceGridToPiecePattern", "refreshMenuButtons"],
								});
								
								
								currentGridSize = {w: Math.ceil(Math.sqrt(pieces.length)), h: Math.ceil(Math.sqrt(pieces.length))};
								for (let j = 0; j < pieces.length; j++){
									let currentInnerPos = {
										x: currentOuterPos.x + ((j % currentGridSize.w) / currentGridSize.w) * currentOuterPos.w,
										y: currentOuterPos.y + (Math.floor(j / currentGridSize.h) / currentGridSize.h) * currentOuterPos.h,
										w: currentOuterPos.w / currentGridSize.w,
										h: currentOuterPos.h / currentGridSize.h
									};
									currentInnerPos.x += currentInnerPos.w * 0.025;
									currentInnerPos.y -= currentInnerPos.h * 0.025;
									currentInnerPos.w *= 0.95;
									currentInnerPos.h *= 0.95;
									
									buttons.menu.push({
										pos: currentInnerPos, text: j, textSize: 0.2, downscaleTextLength: 2, color: pieces[j].color,
										textColor: ((pieceOrder[i] == j) ? "#ffffff" : pieces[j].color), outlineSize: 0.00025, isCentered: false,
										borderColor: ((pieceOrder[i] == j) ? "#ffffff" : "#000000"), borderSize: 0.001,
										onclick: ["<<pieceOrder["+i+"] = "+j+";>>", "setPieceGridToPiecePattern", "refreshMenuButtons"],
									});
								}
							} else{
								buttons.menu.push({
									pos: {x: currentPos.x, y: currentPos.y, w: currentPos.w, h: currentPos.h + 0.01},
									text: "+", textSize: 0.5, isCentered: false, onclick: ["<<pieceOrder.push(pieceOrder[pieceOrder.length-1]);>>", "refreshMenuButtons"],
								});
							}
						}
						
						
						/*bottom templates*/
						currentMiddlePos = {x: -0.175 - 0.01, y: 0.15, w: 0.625, h: 0.175};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
							text: "", textSize: 0.03, color: "#ffffff18", disableClick: true,
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - currentMiddlePos.w/2, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.0065, w: 0.1, h: 0.01},
							text: "templates:", textSize: 0.15, color: "#ffffff00", disableClick: true, isCentered: false,
						});
						
						let pagePos = {x: 0.2075, w: 0.02, h: 0.0175};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - currentMiddlePos.w/2 + pagePos.x - 0.075, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.0115, w: pagePos.w, h: pagePos.h},
							text: "{{defaultValues.doubleLessThan}}", textSize: 0.5, onclick: ["<<runEvent('pageButtonClick', {increment: 0})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - currentMiddlePos.w/2 + pagePos.x - 0.05, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.0115, w: pagePos.w, h: pagePos.h},
							text: "<", textSize: 0.5, onclick: ["<<runEvent('pageButtonClick', {increment: -1})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - currentMiddlePos.w/2 + pagePos.x, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.0115, w: pagePos.w * 3.5, h: pagePos.h},
							text: "page: " + (templatePageNum + 1), textSize: 0.15, disableClick: true,
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - currentMiddlePos.w/2 + pagePos.x + 0.05, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.0115, w: pagePos.w, h: pagePos.h},
							text: ">", textSize: 0.5, onclick: ["<<runEvent('pageButtonClick', {increment: 1})>>", "refreshMenuButtons"],
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - currentMiddlePos.w/2 + pagePos.x + 0.075, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.0115, w: pagePos.w, h: pagePos.h},
							text: "{{defaultValues.doubleMoreThan}}", textSize: 0.5, onclick: ["<<runEvent('pageButtonClick', {increment: Infinity})>>", "refreshMenuButtons"],
						});
						
						
						buttons.menu.push({
							pos: {x: currentMiddlePos.x - currentMiddlePos.w/2 + 0.385, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.0115, w: 0.115, h: pagePos.h},
							text: "auto-start templates: " + (autoStartTemplates ? "on" : "off"), textSize: 0.07,
							onclick: ["<<autoStartTemplates = !autoStartTemplates;>>", "refreshMenuButtons"],
						});
						
						for (let i = 0; i < 12; i++){
							let currentTemplateName = Object.keys(templates)[i + templatePageNum * 12];
							
							if (currentTemplateName != undefined){
								let currentPos = {
									x: (currentMiddlePos.x - currentMiddlePos.w * 0.375) + (i % 3) * 0.15,
									y: (currentMiddlePos.y - currentMiddlePos.h * 0.25) + Math.floor(i / 3) * 0.035,
									w: currentMiddlePos.w * 0.2,
									h: currentMiddlePos.h * 0.15,
								};
								
								let colorsArr = [];
								
								let textArr = templates[currentTemplateName].split(";");
								
								for (let i = 0; i < textArr.length; i++){
									if (textArr[i][0] == "["){
										break;
									} else{
										let currentArr = textArr[i].split(",");
										
										colorsArr.push("#" + currentArr[0]);
									}
								}
								
								let currentButton = {
									pos: {x: currentPos.x, y: currentPos.y, w: currentPos.w, h: currentPos.h},
									color: {
										pos: {
											start: {x: currentPos.x - currentPos.w/2, y: currentPos.y - currentPos.h/2},
											end: {x: currentPos.x + currentPos.w/2, y: currentPos.y + currentPos.h/2}
										},
										colorStops: []
									}, colorsArr: colorsArr,
									text: currentTemplateName, textColor: "#ffffff", textSize: 0.1, outlineSize: 0.000625, downscaleTextLength: 17,
									onclick: ["<<runEvent('loadTemplate', {name: '"+currentTemplateName+"'});>>"]
								};
								
								for (let i = 0; i < colorsArr.length; i++){
									let ratioNum = (i / (colorsArr.length - 1));
									
									if (isNaN(ratioNum)){ ratioNum = 0; }
									
									currentButton.color.colorStops.push(["" + ratioNum, colorsArr[i]]);
								}
								
								buttons.menu.push(currentButton);
							}
						}
						
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + currentMiddlePos.w/2 - 0.15/2, y: currentMiddlePos.y - currentMiddlePos.h/2 + 0.02/2, w: 0.15, h: 0.02},
							text: "Load from URL", textSize: 0.075, onclick: ["loadURL"]
						});
						
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + currentMiddlePos.w/2 - 0.15/2, y: currentMiddlePos.y + currentMiddlePos.h/2 - 0.02/2 - 0.105, w: 0.15, h: 0.02},
							text: "Random Template", textSize: 0.075, onclick: ["clickRandomTemplate"]
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + currentMiddlePos.w/2 - 0.15/2, y: currentMiddlePos.y + currentMiddlePos.h/2 - 0.02/2 - 0.075, w: 0.15, h: 0.02},
							text: "Random Template & Start", textSize: 0.075, onclick: ["clickRandomTemplate", "startButtonClick"]
						});
						
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + currentMiddlePos.w/2 - 0.15/2, y: currentMiddlePos.y + currentMiddlePos.h/2 - 0.02/2 - 0.03, w: 0.15, h: 0.02},
							text: "Randomize All", textSize: 0.075, onclick: ["randomizeTemplate"]
						});
						buttons.menu.push({
							pos: {x: currentMiddlePos.x + currentMiddlePos.w/2 - 0.15/2, y: currentMiddlePos.y + currentMiddlePos.h/2 - 0.02/2, w: 0.15, h: 0.02},
							text: "Randomize All & Start", textSize: 0.075, onclick: ["randomizeTemplate", "startButtonClick"],
							subtext: "[shortcut: r]", subtextPos: {x: 0, y: 0.4}, subtextSize: 0.04
						});
						
						
						
						/*bottom right setup buttons*/
						currentMiddlePos = {x: 0.175, y: 0.0875, w: 0.05, h: 0.025};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h}, color: "#00000000",
							text: "zoom", textSize: 0.5, disableClick: true,
						});
						let borderSize = 0.0015;
						let valuesArr = [1, 2, 4, 8, 16];
						for (let i = 0; i < valuesArr.length; i++){
							buttons.menu.push({
								pos: {x: currentMiddlePos.x + 0.065 + i * 0.055, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
								text: valuesArr[i], textSize: 0.4, borderColor: "#000000", borderSize: ((pixelSize == valuesArr[i]) ? borderSize : 0),
								onclick: ["<<pixelSize = "+valuesArr[i]+";>>", "refreshMenuButtons"],
							});
						}
						currentMiddlePos = {x: 0.175, y: currentMiddlePos.y + 0.05, w: 0.05, h: 0.025};
						buttons.menu.push({
							pos: {x: currentMiddlePos.x, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h}, color: "#00000000",
							text: "speed", textSize: 0.5, disableClick: true,
						});
						valuesArr = [1, 10, 100, 1000, 10000];
						for (let i = 0; i < valuesArr.length; i++){
							buttons.menu.push({
								pos: {x: currentMiddlePos.x + 0.065 + i * 0.055, y: currentMiddlePos.y, w: currentMiddlePos.w, h: currentMiddlePos.h},
								text: valuesArr[i], textSize: 0.4, borderColor: "#000000", borderSize: ((turnsPerFrame == valuesArr[i]) ? borderSize : 0), downscaleTextLength: 2,
								onclick: ["<<turnsPerFrame = "+valuesArr[i]+";>>", "refreshMenuButtons"],
							});
						}
						
						
						runEvent("refreshPieceGrid");
					}>>`],
					
					menuEvents: {
						menuPieceButtonEvents: {
							addPiece: [`<<
								let uniqueColor = getRandomElementOfArray(defaultColors.flat());
								
								let isUnique = false;
								let triesNum = 0;
								while (!isUnique && triesNum < 100){
									isUnique = true;
									for (let i in pieces){
										if (pieces[i].color == uniqueColor){
											isUnique = false;
										}
									}
									
									if (!isUnique){
										uniqueColor = getRandomElementOfArray(defaultColors.flat());
									}
									
									triesNum++;
								}
								
								pieces.push(
									{color: uniqueColor, attackPattern: ["01010","10001","00000","10001","01010"], previousPos: -1, maxEnemies: 0, maxAllies: Infinity}
								);
								
								pieceOrder.push(pieces.length - 1);
							>>`],
							removePiece: [`<<
								if (pieces.length > 1){
									pieces.splice(args.i, 1);
									
									if (selectedPieceNum >= args.i){
										selectedPieceNum--;
										
										if (selectedPieceNum < 0){
											selectedPieceNum = 0;
										}
									}
									
									for (let j = 0; j < pieceOrder.length; j++){
										if (pieceOrder[j] >= args.i){
											if (pieceOrder[j] == args.i){
												pieceOrder.splice(j, 1);
												j--;
											} else{
												pieceOrder[j]--;
											}
										}
									}
									if (pieceOrder.length == 0){
										pieceOrder = [0];
									}
								}
							>>`],
						},
						menuPieceOrderEvents: {
							removePieceOrderIndex: [`<<
								if (pieceOrder.length > 1){
									pieceOrder.splice(args.i, 1);
								}
							>>`],
							movePieceOrderIndex: [`<<
								let targetIndex = args.i + args.increment;
								
								if (pieceOrder[targetIndex] != undefined){
									let currentValue = pieceOrder[args.i];
									
									pieceOrder[args.i] = pieceOrder[targetIndex];
									pieceOrder[targetIndex] = currentValue;
								}
							>>`],
						},
						
						menuAttackerEvents: {
							changeMaxAttackerValues: [`<<
								let currentValue = (args.type == "enemies") ? pieces[selectedPieceNum].maxEnemies : pieces[selectedPieceNum].maxAllies;
								
								if (args.changeType == 0 || args.changeType == Infinity){
									currentValue = args.changeType;
								} else{
									if (currentValue == Infinity){
										currentValue = 5;
									}
									
									currentValue += args.changeType;
								}
								
								if (args.type == "enemies"){
									pieces[selectedPieceNum].maxEnemies = Math.max(currentValue, 0);
								} else{
									pieces[selectedPieceNum].maxAllies = Math.max(currentValue, 0);
								}
							>>`],
							
							randomizeMaxAttackers: [`<<
								let maxEnemies = getRandomElementOfArrayWithWeights(
									[{num: 0, weight: 5}, {num: 1, weight: 4}, {num: 2, weight: 3}, {num: 3, weight: 2}, {num: 4, weight: 1}, {num: Infinity, weight: 1}]
								).num;
								let maxAllies = getRandomElementOfArrayWithWeights(
									[{num: 0, weight: 2}, {num: 1, weight: 2}, {num: 2, weight: 2}, {num: 3, weight: 2}, {num: 4, weight: 3}, {num: Infinity, weight: 5}]
								).num;
								
								pieces[selectedPieceNum].maxEnemies = maxEnemies;
								pieces[selectedPieceNum].maxAllies = maxAllies;
							>>`],
						},
						
						menuGridEvents: {
							refreshPieceGrid: [`<<
								mainGrid.data.w = 0.125 / mainGrid.grid.baseLayer[0].length;
								mainGrid.data.h = 0.125 / mainGrid.grid.baseLayer.length;
								
								mainGrid.data.draw[0].borderSize = 0.005 / mainGrid.grid.baseLayer.length;
								
								layoutSymbols["o"].data.drawTile.color = pieces[selectedPieceNum]?.color ?? layoutSymbols["o"].data.drawTile.color;
								
								layoutSymbols["-"].data.drawTile.color = (layoutSymbols["o"].data.drawTile.color == "#cccccc") ? "#b0b0b0" : "#cccccc";
								
								pieces[selectedPieceNum].attackPattern = [];
								for (let i = 0; i < mainGrid.grid.baseLayer.length; i++){
									pieces[selectedPieceNum].attackPattern[i] = "";
									for (let j = 0; j < mainGrid.grid.baseLayer[i].length; j++){
										pieces[selectedPieceNum].attackPattern[i] += ((mainGrid.grid.baseLayer[i][j].type == "filled") ? "1" : "0");
									}
								}
								
								refreshGridDrawValues();
							>>`],
							setPieceGridToPiecePattern: [`<<
								mainGrid.grid.baseLayer = [];
								for (let i = 0; i < pieces[selectedPieceNum].attackPattern.length; i++){
									mainGrid.grid.baseLayer[i] = [];
									for (let j = 0; j < pieces[selectedPieceNum].attackPattern[i].length; j++){
										mainGrid.grid.baseLayer[i][j] = {type: ((pieces[selectedPieceNum].attackPattern[i][j] == "1") ? "filled" : "empty")};
									}
								}
								mainGrid.grid.baseLayer[Math.floor(mainGrid.grid.baseLayer.length / 2)][Math.floor(mainGrid.grid.baseLayer[0].length / 2)].type = "middle";
								
								refreshGridDrawValues();
							>>`],
							
							increaseGridSize: [`<<
								let currentArr = [];
								for (let i = -1; i < mainGrid.grid.baseLayer.length + 1; i++){
									currentArr.push([]);
									for (let j = -1; j < mainGrid.grid.baseLayer[0].length + 1; j++){
										currentArr[currentArr.length - 1].push(mainGrid.grid.baseLayer[i]?.[j] ?? {type: "empty"});
									}
								}
								mainGrid.grid.baseLayer = currentArr;
								
								runEvent("refreshPieceGrid");
							>>`],
							decreaseGridSize: [`<<
								if (mainGrid.grid.baseLayer.length > 1){
									let currentArr = [];
									for (let i = 1; i < mainGrid.grid.baseLayer.length - 1; i++){
										currentArr.push([]);
										for (let j = 1; j < mainGrid.grid.baseLayer[i].length - 1; j++){
											currentArr[currentArr.length - 1].push(mainGrid.grid.baseLayer[i][j]);
										}
									}
									mainGrid.grid.baseLayer = currentArr;
									
									runEvent("refreshPieceGrid");
								}
							>>`],
							clearGrid: [`<<
								for (let i in mainGrid.grid.baseLayer){
									for (let j in mainGrid.grid.baseLayer[i]){
										mainGrid.grid.baseLayer[i][j].type = "empty";
									}
								}
								mainGrid.grid.baseLayer[Math.floor(mainGrid.grid.baseLayer.length/2)][Math.floor(mainGrid.grid.baseLayer[0].length/2)].type = "middle";
								
								runEvent("refreshPieceGrid");
							>>`],
							resetGrid: [`<<
								mainGrid.grid.baseLayer = [];
								setValuesOnGridFromLayout({gridName: "mainGrid", layerName: "baseLayer", layoutName: "knightLayout"});
								
								runEvent("refreshPieceGrid");
							>>`],
							randomizeGrid: [`<<
								let size = getRandomNum({min: 0, max: 3}) * 2 + 5;
								
								let filledPercentage = Math.random();
								
								mainGrid.grid.baseLayer = [];
								for (let i = 0; i < size; i++){
									mainGrid.grid.baseLayer[i] = [];
									for (let j = 0; j < size; j++){
										mainGrid.grid.baseLayer[i][j] = {type: ((Math.random() < filledPercentage) ? "filled" : "empty")};
									}
								}
								
								mainGrid.grid.baseLayer[Math.floor(mainGrid.grid.baseLayer.length/2)][Math.floor(mainGrid.grid.baseLayer[0].length/2)].type = "middle";
								
								runEvent("refreshPieceGrid");
							>>`],
						},
						
						gridNextFrame: [`<<{
							if (isMouseDown && !isNotesClickable && clickedScrollbar.xy == "" && clickedButton.i == "" && !closestButton.isHover){
								let clickedTilePos = getVertexPositionInGrid(scaledMousePos, mainGrid, "baseLayer");
								
								if ((mainGrid.grid.baseLayer[clickedTilePos.y]?.[clickedTilePos.x]?.type ?? "middle") != "middle"){
									if (clickedTileType == ""){
										clickedTileType = mainGrid.grid.baseLayer[clickedTilePos.y][clickedTilePos.x].type;
									}
									
									mainGrid.grid.baseLayer[clickedTilePos.y][clickedTilePos.x].type = (clickedTileType == "filled") ? "empty" : "filled";
								}
							} else{
								clickedTileType = "";
							}
							
							runEvent("refreshPieceGrid");
						}>>`],
						
						menuPieceOrderNextFrame: {
							randomizePieceOrder: [`<<
								let minLength = getRandomNum({min: pieces.length, max: Math.max(pieces.length * 3, 24)});
								
								pieceOrder = [];
								for (let i = 0; i < minLength; i++){
									pieceOrder.push(Number(getRandomElementNameOfObject(pieces)));
								}
								
								let existsArr = [];
								
								for (let i = 0; i < pieceOrder.length; i++){
									existsArr[pieceOrder[i]] = true;
								}
								
								for (let i = 0; i < pieces.length; i++){
									if (!existsArr[i]){
										insertIntoArrayRandomly(pieceOrder, i);
									}
								}
							>>`],
							resetPieceOrder: [`<<
								pieceOrder = [];
								
								for (let i = 0; i < pieces.length; i++){
									pieceOrder.push(i);
								}
							>>`],
						},
						
						templateEvents: {
							loadTemplate: [`<<
								selectedPieceNum = 0;
								
								runEvent("loadPiecesFromText", {text: templates[args.name]});
								
								runEvent("setPieceGridToPiecePattern");
								runEvent("refreshPieceGrid");
								runEvent("refreshMenuButtons");
								
								if (autoStartTemplates){
									runEvent("startButtonClick");
								}
							>>`],
							
							pageButtonClick: [`<<
								if (args.increment == 0){
									templatePageNum = 0;
								} else if (args.increment < 0){
									templatePageNum += args.increment;
									templatePageNum = Math.max(templatePageNum, 0);
								} else{
									let maxPageNum = Math.ceil(objectLength(templates) / 12) - 1;
									
									if (args.increment == Infinity){
										templatePageNum = maxPageNum;
									} else{
										templatePageNum += args.increment;
										templatePageNum = Math.min(templatePageNum, maxPageNum);
									}
								}
							>>`],
							
							clickRandomTemplate: [`<<
								selectedPieceNum = 0;
								
								runEvent("loadPiecesFromText", {text: getRandomElementOfObject(templates)});
								
								runEvent("setPieceGridToPiecePattern");
								runEvent("refreshPieceGrid");
								runEvent("refreshMenuButtons");
							>>`],
							
							randomizeTemplate: [`<<
								let piecesNum = getRandomNum({min: 2, max: 5});
								
								pieces = [];
								pieceOrder = [];
								for (let i = 0; i < piecesNum; i++){
									runEvent("addPiece");
									
									selectedPieceNum = i;
									
									runEvent("randomizeGrid");
									
									runEvent("randomizeMaxAttackers");
								}
								
								selectedPieceNum = 0;
								runEvent("setPieceGridToPiecePattern");
								
								runEvent("randomizePieceOrder");
								
								runEvent("refreshMenuButtons");
							>>`],
							
							loadURL: [`<<
								selectedPieceNum = 0;
								
								let currentURL = prompt("Input url:");
								
								if (currentURL != null){
									if (currentURL.includes(";")){
										currentURL = currentURL.split("args=");
										currentURL = currentURL[currentURL.length - 1];
										
										runEvent("loadPiecesFromText", {text: currentURL});
										
										for (let i in pieces){
											if (!defaultColors.flat().includes(pieces[i].color) && !customColors.includes(pieces[i].color)){
												customColors.unshift(pieces[i].color);
											}
										}
										customColors = customColors.slice(0, 4);
										
										runEvent("setPieceGridToPiecePattern");
										runEvent("refreshPieceGrid");
										runEvent("refreshMenuButtons");
									}
								}
							>>`],
						},
						
						startButtonEvents: {
							startButtonClick: [`<<
								let urlText = "";
								
								for (let i in pieces){
									let attackText = "";
									
									for (let j in pieces[i].attackPattern){
										attackText += pieces[i].attackPattern[j];
									}
									
									let attackId = getHexadecimalFromBinary("1" + attackText);
									
									urlText += pieces[i].color.slice(1) + "," + attackId;
									
									if ((pieces[i].maxEnemies ?? 0) != 0 || (pieces[i].maxAllies ?? Infinity) != Infinity){
										urlText += "," + pieces[i].maxEnemies + "," + pieces[i].maxAllies;
									}
									
									urlText += ";";
								}
								
								urlText += stringify(pieceOrder) + "," + pixelSize + "," + turnsPerFrame;
								
								window.open(window.location.href + (window.location.search == "" ? "?game=Knight Patterns" : "") + "&args=" + urlText);
							>>`],
							
							startShortcutPress: [`<<
								if (gameState.currentState == "menu"){
									if (inputs["KeyR"]){
										runEvent("randomizeTemplate")
									}
									
									runEvent("startButtonClick");
									
									inputs["Space"] = false;
									inputs["KeyR"] = false;
								} else{
									window.close();
								}
							>>`],
						},
					},
					
					drawEvents: {
						generateSpiralGrid: [`<<
							spiralGrid = [];
							
							let size = Math.round(Math.max(canvas.width, canvas.height) / pixelSize);
							
							for (let i = 0; i < size; i++){
								spiralGrid[i] = [];
								for (let j = 0; j < size; j++){
									spiralGrid[i][j] = {pieceNum: -1, attackers: []};
									
									for (let k = 0; k < pieces.length; k++){
										spiralGrid[i][j].attackers[k] = 0;
									}
								}
							}
						>>`],
						
						generateSpiralTilePos: [`<<
							let middlePos = {x: Math.round(spiralGrid[0].length / 2), y: Math.round(spiralGrid.length / 2)};
							
							let currentMovementNum = 0;
							let currentDirection = 3;
							let currentPos = {...middlePos};
							
							spiralTilePos = [{x: currentPos.x, y: currentPos.y}];
							
							while (spiralTilePos.length < (spiralGrid[0].length * spiralGrid.length)){
								if (currentDirection == 1 || currentDirection == 3){
									currentMovementNum += 1;
								}
								
								for (let i = 0; i < currentMovementNum; i++){
									if (spiralTilePos.length < (spiralGrid[0].length * spiralGrid.length)){
										currentPos.x += directions[currentDirection].x;
										currentPos.y += directions[currentDirection].y;
										
										spiralTilePos.push({x: currentPos.x, y: currentPos.y});
									}
								}
								
								currentDirection++;
								if (currentDirection > 3){ currentDirection = 0; }
							}
							
							let canvasCenterPos = {x: Math.round(canvas.width / 2), y: Math.round(canvas.height / 2)};
							
							spiralCenterOffset = {
								x: canvasCenterPos.x - middlePos.x,
								y: canvasCenterPos.y - middlePos.y
							};
						>>`],
						
						placePieces: [`<<
							let foundLegalPlacement = false;
							
							if (!isDrawingFinished){
								for (let turnNum = 0; turnNum < turnsPerFrame * 2; turnNum += pieceOrder.length){
									for (let pieceNum of pieceOrder){
										for (let i = pieces[pieceNum].previousPos + 1; i < spiralTilePos.length; i++){
											let currentTile = spiralGrid[spiralTilePos[i].y]?.[spiralTilePos[i].x];
											
											if (currentTile != undefined){
												if (currentTile.pieceNum == -1){
													let alliesNum = currentTile.attackers[pieceNum];
													let enemiesNum = 0;
													for (let j in currentTile.attackers){
														if (j != pieceNum){
															enemiesNum += currentTile.attackers[j];
														}
													}
													
													let areEnemiesCorrect = enemiesNum <= (pieces[pieceNum].maxEnemies ?? 0);
													let areAlliesCorrect = alliesNum <= (pieces[pieceNum].maxAllies ?? Infinity);
													
													/*if ((pieces[pieceNum].minEnemies ?? 0) > 0){ //minEnemies rarely works because of the previousPos not resetting to 0 each turn
														if ((pieces[pieceNum].minEnemies ?? 0) > i){ areEnemiesCorrect = false; }
														
														areEnemiesCorrect = areEnemiesCorrect && (enemiesNum >= (pieces[pieceNum].minEnemies ?? 1));
													}*/
													
													if (areEnemiesCorrect && areAlliesCorrect){
														spiralGrid[spiralTilePos[i].y][spiralTilePos[i].x].pieceNum = pieceNum;
														
														foundLegalPlacement = true;
														
														let middlePos = {x: spiralTilePos[0].x, y: spiralTilePos[0].y};
														let testPos = {
															x: spiralTilePos[i].x + spiralCenterOffset.x,
															y: spiralTilePos[i].y + spiralCenterOffset.y,
														};
														let drawPos = {
															x: (spiralTilePos[i].x - middlePos.x) * pixelSize + middlePos.x + spiralCenterOffset.x,
															y: (spiralTilePos[i].y - middlePos.y) * pixelSize + middlePos.y + spiralCenterOffset.y,
														};
														ctx.fillStyle = pieces[pieceNum].color;
														ctx.fillRect(drawPos.x, drawPos.y, pixelSize, pixelSize);
														
														/*Attack tiles*/
														let patternArr = pieces[pieceNum].attackPattern;
														
														for (let k = 0; k < patternArr.length; k++){
															for (let l = 0; l < patternArr[k].length; l++){
																if (patternArr[k][l] == "1"){
																	let currentPos = {
																		x: (l - Math.floor(patternArr[k].length/2)) + spiralTilePos[i].x,
																		y: (k - Math.floor(patternArr.length/2)) + spiralTilePos[i].y,
																	};
																	
																	if (spiralGrid[currentPos.y]?.[currentPos.x] != undefined){
																		spiralGrid[currentPos.y][currentPos.x].attackers[pieceNum]++;
																	}
																}
															}
														}
														
														break;
													}
												}
												
												pieces[pieceNum].previousPos = i;
											}
										}
									}
								}
							}
							
							if (!foundLegalPlacement){
								isDrawingFinished = true;
							}
						>>`],
					},
				},
				
				gridNames: ["mainGrid"],
				
				buttons: {
					menu: [
						{...gamePresets.quitButton}
					],
				},
			},
			createdVariables: {
				spiralGrid: [],
				spiralTilePos: [],
				
				spiralCenterOffset: {x: 0, y: 0},
				pixelSize: 1,
				turnsPerFrame: 10000,
				isDrawingFinished: false,
				
				pieceOrder: [0, 1],
				
				selectedPieceNum: 0,
				clickedTileType: "",
				
				defaultColors: [
					["#ff8848", "#4888ff", colors.enby[0], colors.enby[2], colors.enby[3]],
					[colors.lesbian[0], colors.lesbian[1], colors.lesbian[3], colors.lesbian[4], colors.pride[0]],
					[colors.pride[1], colors.pride[2], colors.pride[3], colors.pride[4], colors.pride[5]],
					[colors.pan[0], colors.pan[1], colors.pan[2], colors.trans[0], colors.trans[1]],
					["#ffffff", "#cccccc", "#999999", "#666666", "#333333"],
				],
				customColors: [],
				
				templatePageNum: 0,
				autoStartTemplates: false,
				
				templates: {
					//awesome ones
					"triangle forest": "9b59d0,2a8822a,0,0;2d2d2d,2a8822a,3,2;[0,1],1,10000",
					"strongly mountain shape": "333333,3150151,Infinity,3;ffffff,2a8822a,0,0;[0,1],1,10000",
					"tower in the noise": "ff218c,2a8822a,2;ffd800,282808000000000020282,2;[0,1],1,10000",
					"complex and simple": "333333,3150151,2,3;ffffff,2a8822a,0,0;[0,1],1,10000",
					"red blue quadrants": "4888ff,2000000000640;e50000,38f080a294a5965604a99,3,4;333333,3fffffeffffff,1,4;[1,2,0,0,1,2,0,1,0,2,0,1,2,0,0,2,1],1,10000",
					"the pyramid": "999999,3fecfee,1,0;ef7627,200000000000000000701f07f1ff7ff,1,Infinity;[0,1],1,10000",
					
					//city grid
					"city blocks": "666666,3ffffffffffffffefffffffffffffff,0,0;cccccc,2000000000000,3,0;[1,1,1,1,1,1,1,0],4,10000",
					"city grid": "2d2d2d,3ffffffffffffffefffffffffffffff,0,0;cccccc,2000000000000,2,0;[1,1,1,1,1,1,1,0],1,10000",
					"city grid with parks": "2d2d2d,3ffffffffffffffefffffffffffffff,0,0;cccccc,2000000000000,2,0;028121,3fffffffffeffffffffff;[1,1,1,1,1,1,1,0,2],2,10000",
					
					//zoomed in pictures
					"triangles over lines": "cccccc,228;333333,228;d162a4,228;ffffff,228;666666,228;[0,1,2,3,4],8,10000",
					"pillow-material-like texture": "ff8848,2904a83573c79d582a412,1,3;4888ff,30ad0a86f642f,0,1;ffffff,2204000200000010280408002108405,1,1;[0,1,2],2,10000",
					"random nice pattern": "ffee00,2fbe5ef,1,4;ff8b00,3edc2f7,1,1;004cff,3ffefff,0,0;5bcefa,27c002410109384443320,0,3;[1,1,3,1,3,2,2,1,2,0,1,1,0,3,1,2,3,0,1,0,1],2,10000",
					
					//infinite triangles
					"green and yellow triangles": "028121,205022e;ffd800,2e88140,5,2;[0,1],1,10000",
					"blurry triangles": "028121,2aaaaaa,Infinity,4;cccccc,2000000;[0,1],1,10000",
					"simplest triangles": "028121,2050140,Infinity,1;cccccc,2000000;[0,1],1,10000",
					"simpler breakout": "5bcefa,2a8822a,0,4;ffffff,2a8822a,1,3;[0,1],1,10000",
					
					//worlds
					"green universe": "2d2d2d,3a6da0bf044c102160b73,0,4;f5a9b8,200400602c244820dc859,3,4;028121,34d922c4b94aeb20c8936,1,0;[0,1,2],1,10000",
					"tore apart world": "5bcefa,3904d93,2,4;004cff,3feefff,1,Infinity;999999,2600ec8564401;333333,289e209,3,1;ff218c,2000000,2,3;[0,1,2,3,4],1,10000",
					"grainy universe": "e50000,237a625,2,2;9b59d0,23ad2221170a9,2,3;cccccc,2c9b2d2501140,3,4;ff218c,2fd5ae83a45c54acee9dbf735be7c87,1,3;[0,0,0,1,3,2,1,3,1,2,3],1,10000",
					"wavy lands": "fff433,2a024002014a014080002,1,2;ffffff,3fffdfffffefffffdffff,1,4;d52d00,3fbeebb,1,Infinity;333333,3baeffb,2,4;[0,3,0,2,1,0],1,10000",
					"vaguely patterned universe": "5bcefa,2852104;ffffff,354b1008102f600282340,0,2;4888ff,3fdffb7fe7ffdbfe7ffe6fcffffffff,0,4;e50000,34201c8,1,4;[0,0,3,0,3,1,3,3,3,1,1,0,0,0,2,1,3,0,3,0,2],1,10000",
					"cyan yellow universe": "333333,3ffff7ffff6fdfff57f7e,1,2;5bcefa,2600562080caa9c31922c,0,4;ffd800,26b3f79206dbce22c8124335416706e;[0,1,2],1,10000",
					"wild world": "ef7627,31012100c8045,0,2;d162a4,2428200000042;ffffff,200c00d002a0080040110,3,Infinity;333333,3ff7fffdfdaffffffffff,2,Infinity;[0,1,2,2,3,3],1,10000",
					"shaded wild world": "ef7627,31012100c8045,0,2;d162a4,2428200000042;ffffff,200c00d002a0080040110,3,Infinity;333333,3ff7fffdfdaffffffffff,2,Infinity;[0,1,3,3,3,2],1,10000",
					"parted world": "2d2d2d,2ebfd7eddff7b,2,4;d52d00,3b0864a641612,3,3;666666,29e01221108189029507c,0,3;21b1ff,2002000101040,2,Infinity;ffffff,200602a002000000400081b11040000,1,Infinity;[1,0,1,0,0,4,0,1,4,1,2,2,3,3,4,0],1,10000",
					"red gray world": "f5a9b8,2af5775112424241c4100,2,3;e50000,33043c1,0,4;999999,35d634b,1,Infinity;d52d00,336fffdbd7efba7ffdbee;[0,1,3,2,2,2,2,3,1,1,2,3],1,10000",
					"two worlds": "d52d00,21945280905b0;028121,206f000009c60;770088,264ca981b8626,1,3;[0,1,2],1,10000",
					"three worlds": "21b1ff,3a9100810a4469e00fc23a583b5f677;2d2d2d,200040000000000000008,0,4;5bcefa,2bec112ad0448;ff218c,2218802242cc0,Infinity,4;ffd800,2120a640044142e184011,1,Infinity;[4,0,2,3,2,2,4,0,2,1,1,3,4,3,4,4,1,3,0],1,10000",
					"bee colored world": "fff433,3756ea6eecf7f,1,4;333333,24600ca,0,4;ffd800,3b12fcae2229c2bc67150,1,2;2d2d2d,3ffefff,0,1;ff8b00,3f5ef7f,0,4;[1,3,4,2,2,1,3,3,0,1,2,2],1,10000",
					"glitchy world": "5bcefa,35601bd465e9437597fde,1,3;333333,2c830d585763e2e146e76;e50000,3efe3ff,4,Infinity;ff8b00,2010400,0,1;[3,3,3,0,3,1,2,3],1,10000",
					
					//kinda mirrored kinda mountains
					"two-sided pattern": "9b59d0,2a8822a,0,0;2d2d2d,2a8822a,4,2;[0,1],1,10000",
					"two-sided pattern more detailed": "9b59d0,2a8822a,0,0;2d2d2d,2a8822a,2,2;[0,1],1,10000",
					"vaguely mountain shape": "9b59d0,2426c84;770088,273e318;[0,1],1,10000",
					
					//quadrants
					"wavy quadrants": "21b1ff,2426c84;004cff,231e39c;[0,1],1,10000",
					"wilder quadrants": "ff218c,2426c84;ffd800,231e39c;21b1ff,231e39c;[0,1,2],1,10000",
					"evil quadrants": "2d2d2d,220242a99c0aa64a1c830,2,0;e50000,325821a,2,0;[0,1],1,10000",
					"random quadrants": "ff8848,23b872a,2,4;4888ff,22618b4,2,1;[0,1],1,10000",
					
					//random small patterns
					"wild center": "fff433,2a8822a;ffffff,2a8822a;9b59d0,2a8822a;2d2d2d,2a8822a;[0,1,2,3,0,3],1,10000",
					"patterns galore": "fff433,2a8822a;ffffff,2a8822a;9b59d0,2a8822a;2d2d2d,2a8822a;[3,0,0,0,1,1,1,2,2,2],1,10000",
					"top right hill": "fff433,2a8822a;ffffff,2a8822a;9b59d0,2a8822a;2d2d2d,2a8822a;[3,0,0,0,1,1,1,3,3,2,2,2],1,10000",
					
					//mazes
					"spiral squares maze": "ff218c,2a8822a;ffd800,28a08000020a2;[0,1],1,10000",
					"square maze": "ff8800,2a8822a,2,2;0088ff,2a8822a,2,2;[0,1],1,10000",
					"maze center": "333333,3576dd5;028121,2a8822a;[0,0,1],1,10000",
					"big maze center": "028121,3576dd5;333333,2a8822a;[0,0,0,1,0,1,1,1,0,1,0,0,1],1,10000",
					"spaceship maze": "ff218c,2a8822a;ffd800,282808000000000020282;[0,1],1,10000",
					"unexplainable maze": "ff218c,2a8822a;ffd800,282808000000000020282;[1,0,1],1,10000",
					"maze with outlines": "ff8b00,2e30a04,1,Infinity;5bcefa,3fffffffffef7dfffffff;9b59d0,2800442;999999,3fedeb9ffe3fff7abefe6fdfff5f6ff,2,Infinity;[0,1,2,3],1,10000",
					"random smooth maze": "ff8848,37ea9cb451ade928a77accbe1d25f75;4888ff,2a8822a,0,2;[0,1],1,10000",
					"broken maze": "2d2d2d,2180414010004;d162a4,3bbfcf7b9a4e366ce8395,3,Infinity;[0,1,0,0,0,0,0,1,0,0],1,10000",
					
					//many symmetric sides
					"12 sides": "9b59d0,2e8c62e,0,4;[0],1,10000",
					"knight octogons": "770088,2a8822a,Infinity,1;2d2d2d,2a8822a,0,1;[0,1],2,10000",
					
					//clean shapes, outlines
					"squigly triangles": "5bcefa,3ff7eff7ffeffdffffbfb,2,Infinity;028121,2fffffeffffff,2,Infinity;[1,0,1,1,0,0,1,0],1,10000",
					"random wavy pattern": "9b59d0,21263320080804809100040a0080008;f5a9b8,380fd09b0006c1901c248;[0,1],1,10000",
					"random wavy pattern weirder": "9b59d0,21263320080804809100040a0080008,1,12;f5a9b8,380fd09b0006c1901c248,1,15;[0,1],1,10000",
					
					//basic
					"repeating triangles": "ff218c,2a8822a,2;ffd800,28a08000020a2;21b1ff,2200008200008;[0,1,2],1,10000",
					"increasing triangles": "e50000,3e3c78e1e3c78;5bcefa,2a8822a;[0,1],1,10000",
					"increasing claw marks": "4888ff,200000000000000040404;5bcefa,2a8822a;[0,1],1,10000",
					
					//kinda hard to look at
					"witness lines": "9b59d0,2e8c62e,0,3;[0],4,10000",
					"arrows in the gaps": "4888ff,2a8822a;21b1ff,2a8822a,1,0;5bcefa,2200008200008;[0,1,2,1],1,10000",
					"patterns breaking out": "ff8848,2a8822a,0,0;4888ff,2a8822a,0,0;5bcefa,2a8822a,0,0;ef7627,2a8822a,0,0;ffffff,2a8822a,1,3;[0,1,2,3,4],1,10000",
					"wavy-triangle corner": "ffffff,2008080,3,0;ff8848,3022005210a090023120028d0098801,1,Infinity;ffd800,2158454,0,4;[2,1,2,0,2],1,10000",
					"tiny patterns": "028121,2050140,Infinity,0;ffffff,2a8822a,0,0;[0,1],1,10000",
					"triangle rays": "028121,2050140,Infinity,1;ffffff,2a8822a,0,0;[0,1],1,10000",
					
					//waves
					"squares waves": "5bcefa,2a8822a;21b1ff,2a8822a;004cff,2a8822a,1,0;333333,2a8822a;[3,0,0,0,1,1,1,2,2,2],1,10000",
					"straight waves": "ffd800,204010040000004010040;770088,2a8822a;[0,1],1,10000",
					"wavy waves": "ff218c,2414504;028121,2a8aa2a;[0,1],1,10000",
					"spaceship waves": "ff218c,300401004000040100401;ffd800,2a8822a;[0,1],1,10000",
					"polygonal waves": "ff218c,2a8822a,1;ffd800,282808000000000020282,1;[0,1],1,10000",
					"unique waves": "2d2d2d,2ffc73e,0,3;ff218c,2040000204000810000420380588248,0,4;[0,1],1,10000",
					
					//vaguely 3d
					"vaguely 3D effect": "ff8848,2182830000000;4888ff,2a8822a;[0,1],1,10000",
					"harsh pattern": "ff8848,20e0682c0e00000000000;4888ff,2a8822a;[0,1],1,10000",
					
					//basic knights
					"two knights": "ff218c,2a8822a;ffd800,2a8822a;[0,1],1,10000",
					"modified three knights": "ff218c,2a8822a;ffd800,2a8822a;21b1ff,2a8822a;[0,1,2,2],1,10000",
					"modified four knights": "ff218c,2a8822a;ffd800,2a8822a;21b1ff,2a8822a;5bcefa,2a8822a;[0,0,1,2,3,0,3],1,10000",
					
					"very modified three knights": "ff218c,2a8822a;ffd800,2a8822a;21b1ff,2a8822a;[0,1,0,1,0,1,2,2,2],1,10000",
					
					"knight-knight-threeleaper": "ff218c,2a8822a;ffd800,2a8822a;21b1ff,2200008200008;[0,1,2],1,10000",
					/*
						modified four knights:
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[2,2,1,0,3,2,3],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[3,3,3,0,1,0,1,1,3,1,0,1,1,3,2,1,0,2,0],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[0,1,0,0,2,2,2,0,0,0,3,1,1,2,2,2,0,1,3,2,2],1,10000
						
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[2,0,3,0,3,0,0,1,2,1,2,2,0,0,1,2,2,1,0,2,0,3,1,1],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[0,2,0,2,2,3,0,1,1,0,0],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[0,0,2,0,3,3,0,1,1,1,0,1,0,2,3,0,2,1,1,1,0,1],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[0,1,2,3,2,3,2],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[0,1,3,2,2,2,0,3,2,3,3],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[0,1,0,1,1,0,2,3,2,1,0,2,1,0],1,10000
						ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[1,1,0,2,2,0,0,2,2,2,1,1,3,0,1,3,1],1,10000
						(not as good) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[3,3,3,2,1,2,1,1,0,0,2],1,10000
						(not good) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[2,3,3,1,1,3,1,0,1],1,10000
						(nou) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[0,1,0,3,1,0,0,2,2,3,2,1,3,3],1,10000
						(up only) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;[1,1,3,3,2,2,0,0,1,2,1,0],1,10000
						
						five knights:
						
						(promising) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[4,1,4,0,1,2,1,2,1,0,3,4,4,3],1,10000
						(it's something) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[0,1,2,3,4,3],1,10000
						(bottom right) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[2,2,1,3,0,4,0,2,2,3,0,2],1,10000
						(top left) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[4,4,4,1,1,0,3,4,0,2,4,4,4,0],1,10000
						(crazy color switches) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[0,3,3,2,4,0,4,2,0,2,1,1,4,0,2,1,4,0,4,0],1,10000
						(technically top right) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[4,4,1,4,1,0,3,4,2],1,10000
						(technically top right 2) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[3,4,0,3,1,4,0,0,4,0,3,1,1,3,4,1,3,4,0,4,0,4,2],1,10000
						(two squares in corners) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[0,0,1,4,4,3,4,1,3,1,2,4,2,1,4,4,1,3,2,4],1,10000
						(smol) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[2,1,2,4,1,3,1,2,2,0,4,2,4],1,10000
						(four corners) ff8848,2a8822a;4888ff,2a8822a;028121,2a8822a;770088,2a8822a;9b59d0,2a8822a;[3,3,0,4,1,1,2,2,4,1,4,0,4,4,2,4,1,3,0,0],1,10000
					*/
				},
				
				pieces: [
					{color: "#ff8848", attackPattern: ["01010","10001","00000","10001","01010"], previousPos: -1, maxEnemies: 0, maxAllies: Infinity},
					{color: "#4888ff", attackPattern: ["01010","10001","00000","10001","01010"], previousPos: -1, maxEnemies: 0, maxAllies: Infinity},
				],
				
				
				layoutSymbols: {
					"-": {baseLayer: {type: "empty"}, data: {drawTile: {color: "#cccccc"}}},
					"o": {baseLayer: {type: "filled"}, data: {drawTile: {color: "#ff8848"}}},
					"x": {baseLayer: {type: "middle"}, data: {drawTile: {color: "#000000"}}},
				},
				
				knightLayout: {
					symbols: "layoutSymbols",
					arr: [
						"-o-o-",
						"o---o",
						"--x--",
						"o---o",
						"-o-o-",
					]
				},
				
				mainGrid: {
					grid: {},
					data: {
						x: 0.0875, y: -0.166  - 0.05, w: 0.02, h: 0.02, gaps: {left: 0, right: 0, up: 0, down: 0}, isCentered: false,
						gridShape: "rect",
						gridSize: {w: 0, h: 0}, layers: ["baseLayer"], gameState: "menu",
						isFastClick: true,
						isDragClick: true,
						hasHitboxes: true,
						
						onload: [
							{f: "setValuesOnGridFromLayout", args: {layoutName: "knightLayout"}},
							{f: "refreshGridSize"},
						],
						
						draw: [
							{f: "fillGridShape", args: {id: "drawTile", color: "#444444", borderColor: "#000000", borderSize: 0.001}},
							{f: "fillGridSprite", args: {id: "drawSprite", spriteSize: {w: 0.9, h: 0.85}}},
						],
						
						tilesData: {symbols: "layoutSymbols", valueName: "type"},
						
						gridDrawData: [],
						gridDrawValues: {},
					}
				},
			},
			modifiedVariables: {
				camera: {zoom: {level: 1, min: 0.005}, areDimentionsEqual: true, minWidthToHeightRatio: 2, ...gamePresets["lockedCamera"]},
				
				gameState: {currentState: "menu", states: ["menu", "draw"]},
			},
			data: {
				description: "Make unpredictable patterns using custom chess pieces!\nInspired by Numberphile's \"Red & Black Knights\" video",
				releaseDate: "Mid 2026",
				tags: ["patterns", "tool", "pretty"],
				/*videos: [
					{name: "Showcase/Walkthrough Video"},
					{name: '\\"How It Was Made\\" Video'},
				]*/
			},
		},
		
		"Plant Catcher": {
			overriddenVariables: {
				drawOrder: ["drawGrids", "drawEntities", "drawButtons", "drawScrollbars"],
				
				inputButtons: {
					run: {keyboard: ["ShiftLeft"], gamepads: [[2],[2],[2],[2]], timer: 0, maxTimer: 0},
				},
				
				events: {
					onload: ["generateMainLayout", "generatePlantAttacks", "generateGrids", "generateEarthEntity", "refreshPlantEntities"],
					onNextFrame: ["moveEntities", "teleportPlayer", "refreshHudButtons", "draw"],
					
					//refreshScrollbars: [{f: "setScrollbarsToGrids", args: {state: "graph", margin: {left: 0.25, right: 0.25, up: 0.25, down: 0.25}}}],
					
					teleportPlayer: [`<<{
						if (entities[0].pos.x < -21.955){
							entities[0].pos.x = 21.955;
						}
						if (entities[0].pos.x > 21.955){
							entities[0].pos.x = -21.955;
						}
						if (entities[0].pos.y < -11.955){
							entities[0].pos.y = -11.955 + 2;
							entities[0].pos.x *= -1;
						}
						if (entities[0].pos.y > 10.2955){
							entities[0].pos.y = 10.2955 - 2;
							entities[0].pos.x *= -1;
						}
					}>>`],
					
					mapGenerationEvents: {
						generateMainLayout: [`<<{
							mainLayout.arr = [];
							
							for (let i = 0; i < 12; i++){
								mainLayout.arr[i] = "";
								for (let j = 0; j < 22; j++){
									mainLayout.arr[i] += (plantOccurencesGrid[i]?.[j] != null) ? "o" : "-";
									
									if (plantOccurencesGrid[i]?.[j] != null){
										for (let k in plantOccurencesGrid[i][j]){
											plantOccurencesGrid[i][j][k].level = 0;
											
											if (!developmentMode){
												hiddenPlants[plantOccurencesGrid[i][j][k].name] = true;
											}
										}
									}
								}
							}
						}>>`],
						generateEarthEntity: [`<<{
							let earthArr = structuredClone(earthEntity);
							
							earthArr.color = {};
							earthArr.fillOutline = {};
							earthArr.lineWidth = 0.0001;
							earthArr.isClickable = false;
							earthArr.isFill = false;
							earthArr.pos.arr = {};
							earthArr.gameState = "game";
							
							for (let i in earthEntity.pos.arr){
								for (let j in earthEntity.pos.arr[i]){
									let currentArr = earthEntity.pos.arr[i][j];
									
									if (i == "South Africa"){
										currentArr = structuredClone(currentArr);
										currentArr.splice(87, 24);
									}
									
									let currentObject = Object.assign({}, currentArr);
									
									
									if (objectLength(currentObject) > 0){
										earthArr.pos.arr[i + "" + j] = currentObject;
										
										earthArr.color[i + "" + j] = "#000000";
										earthArr.fillOutline[i + "" + j] = "#000000";
									}
								}
							}
							
							earthArr.boxPos = {x: -22, y: -12, w: 22, h: 22.4};
							
							entities.push(earthArr);
						}>>`],
						
						refreshPlantEntities: [`<<{
							let previousEntities = structuredClone(entities);
							plantEntities = [];
							
							for (let i = 0; i < mainGrid.grid.mainLayer.length; i++){
								for (let j = 0; j < mainGrid.grid.mainLayer[i].length; j++){
									if (mainGrid.grid.mainLayer[i][j].type == "land"){
										let plantWeights = [];
										
										for (let k = 0; k < plantOccurencesGrid[i][j].length; k++){
											if (k == 0 || hasStarterPlant){
												plantWeights.push({value: plantOccurencesGrid[i][j][k].name, weight: 2**(plantOccurencesGrid[i][j].length - k), index: k});
											}
										}
										
										let currentPlant = getRandomElementOfArrayWithWeights(plantWeights);
										
										let currentLevel = getRandomNum({min: 1 + (currentPlant.index*5), max: 6 + (currentPlant.index*22)});
										
										plantEntities.push({name: currentPlant.value, pos: {x: j, y: i}, index: currentPlant.index, level: currentLevel});
									}
								}
							}
							
							entities = [entities[0], entities[1]];
							
							for (let i in plantEntities){
								let tilePos = getGridTilePos(plantEntities[i].pos);
								let pos = {...tilePos};
								
								let currentArr = plantEntities[i];
								
								if (plantEntities[i].pos.x == args.savePlantPos?.x && plantEntities[i].pos.y == args.savePlantPos?.y){
									/*currentArr = previousPlantEntities[i]; log(previousPlantEntities[i]);
									
									pos = getGridTilePos(currentArr.pos);*/
									let savedEntityNums = [];
									
									for (let j = 2; j < previousEntities.length; j++){
										if (previousEntities[j].plantPos?.x == plantEntities[i].pos.x && previousEntities[j].plantPos?.y == plantEntities[i].pos.y){
											savedEntityNums.push(j);
										}
									}
									
									for (let j in savedEntityNums){
										entities.push(previousEntities[savedEntityNums[j]]);
									}
								} else{
									let currentPos = {...tilePos};
									
									let currentRange = {min: 0.2, max: 0.9};
									
									pos = {
										x: pos.x + getRandomNumWithDecimals(currentRange) * pos.w,
										y: pos.y + getRandomNumWithDecimals(currentRange) * pos.h
									};
									
									let plantTileIndex = currentArr.index;
									let rarityColor = rarityColors[plantTileIndex];
									
									/*let typeColor = plantTypes[plantsData[currentArr.name].type].color;*/
									
									let tilePlants = [...plantOccurencesGrid[currentArr.pos.y][currentArr.pos.x], currentArr];
									
									for (let j = 0; j < tilePlants.length; j++){
										let currentName = tilePlants[j].name;
										let isAlly = (j != tilePlants.length - 1);
										
										if (tilePlants[j].level > 0 || developmentMode){
											let currentEntity = {
												pos: {x: pos.x, y: pos.y, w: 0.4, shape: "circle"}, hitboxShape: "circle",
												color: rarityColor, drawLayer: 1-isAlly, gameState: "game",
												plantPos: currentArr.pos, plantName: currentName, plantLevel: tilePlants[j].level, rarityColor: rarityColor, isAlly: isAlly
											};
											
											if (isAlly){
												currentEntity.pos.x = tilePos.x + tilePos.w/4 * (j+1);
												currentEntity.pos.y = tilePos.y + tilePos.h/2;
												
												currentEntity.plantNum = j;
											} else{
												for (let k = 0; k < tilePlants.length - 1; k++){
													if (tilePlants[k].name == currentName){
														currentEntity.plantNum = k;
													}
												}
											}
											
											let currentSprite = (hiddenPlants[currentName]) ? {...(gameSprites[currentName] ?? gameSprites[defaultPlantName]), color: "#000000"} : (gameSprites[currentName] ?? gameSprites[defaultPlantName]);
											
											currentEntity = {
												...currentEntity,
												...(currentSprite),
												boxPos: {x: currentEntity.pos.x, y: currentEntity.pos.y, w: currentEntity.pos.w, h: currentEntity.pos.w},
												shadowColor: "#00000066",
												shadowPos: {x: 0.002, y: 0.002},
											};
											
											entities.push(currentEntity);
										}
									}
								}
							}
							
							runEvent("refreshHudButtons");
						}>>`],
					},
					
					generatePlantAttacks: [`<<{
						for (let i in plantsData){
							plantsData[i].attackTypes = [];
							
							for (let j in plantAttackTypes){
								if (j != "Basic"){
									let hasAttack = true;
									
									let isPentapetalae = plantTypes[plantsData[i].type].isPentapetalae ?? plantsData[i].isPentapetalae;
									
									if (isPentapetalae != (plantAttackTypes[j].isPentapetalae ?? isPentapetalae)){
										hasAttack = false;
									}
									if (plantsData[i].type != (plantAttackTypes[j].type ?? plantsData[i].type)){
										hasAttack = false;
									}
									if (plantAttackTypes[j].words != undefined){
										let hasWords = false;
										
										for (let k in plantAttackTypes[j].words){
											if (plantsData[i].name.toLowerCase().includes(plantAttackTypes[j].words[k])){
												hasWords = true;
											}
										}
										if (!hasWords){ hasAttack = false; }
									}
									if (plantsData[i].name.length > (plantAttackTypes[j].maxLetters ?? Infinity)){
										hasAttack = false;
									}
									if (plantsData[i].name.split(" ").length < (plantAttackTypes[j].minWords ?? 0)){
										hasAttack = false;
									}
									
									if (hasAttack){
										plantsData[i].attackTypes.push(j);
									}
								}
							}
							
							if (plantsData[i].attackTypes.length < 2){
								plantsData[i].attackTypes.push("Basic");
							}
						}
					}>>`],
					
					hudEvents: {
						refreshHudButtons: [`<<{
							let hudButtons = [];
							
							let pos = getVertexPositionInGrid(entities[0].pos);
							
							let arr = plantOccurencesGrid[pos.y]?.[pos.x];
							
							for (let i in entities){
								if (entities[i].plantPos != undefined){
									entities[i].isVisible = false;
								}
							}
							
							let text = "";
							
							if (arr != null && fightData.tilePos.x == -1){
								for (let i in arr){
									if (i > 0){
										text += "\\n";
									}
									
									if (hiddenPlants[arr[i].name]){
										text += "???";
									} else{
										text += plantsData[arr[i].name].name/*+": "+arr[i].amount*/+" (lv "+arr[i].level+")";
									}
									
									text += (gameSprites[arr[i].name] != undefined) ? " !" : "";
								}
								
								hudButtons.push({
									text: text, pos: {x: 0.1, y: 0.1, w: 0.15, h: 0.15}, textSize: 0.065, marginY: 0.15, isAbsolutePositioned: true,
									color: "#222222", textColor: "#ffffff", drawLayer: 5, downscaleTextLength: 27, disableClick: true
								});
							}
							
							let currentEnemyPos = {x: 0, y: 0};
							let rarityColor = rarityColors[fightData.plantValues?.plantNum ?? 0];
							let enemyLevel = 1;
							let alliesPos = [];
							let allyLevels = [];
							
							if (fightData.tilePos.x == -1){
								for (let i in entities){
									if (entities[i].plantPos?.x == pos.x && entities[i].plantPos?.y == pos.y){
										entities[i].isVisible = true;
										
										if (entities[i].isAlly){
											alliesPos.push(entities[i].boxPos ?? entities[i].pos);
											allyLevels.push(entities[i].plantLevel);
										} else{
											currentEnemyPos = entities[i].boxPos ?? entities[i].pos;
											
											rarityColor = entities[i].rarityColor;
											enemyLevel = entities[i].plantLevel;
										}
									}
								}
							} else{
								for (let i in entities){
									if (entities[i].plantPos?.x == fightData.tilePos.x && entities[i].plantPos?.y == fightData.tilePos.y){
										if (!entities[i].isAlly){
											entities[i].isVisible = true;
											
											currentEnemyPos = entities[i].boxPos ?? entities[i].pos;
										}
									}
									
									if (entities[i].plantPos?.x == fightData.attackingTilePos?.x && entities[i].plantPos?.y == fightData.attackingTilePos?.y){
										if (entities[i].isAlly && entities[i].plantNum == fightData.attackingPlantNum){
											alliesPos.push(entities[i].boxPos ?? entities[i].pos);
											allyLevels.push(entities[i].plantLevel);
											
											entities[i].isVisible = true;
										}
									}
								}
							}
							
							/*Fight buttons*/
							
							enemyLevel = fightData.plantValues?.level ?? ((hasStarterPlant) ? enemyLevel : 5);
							
							let currentText = (hasStarterPlant) ? "Fight" : "Choose";
							
							if (fightData.attackingTilePos?.x != -1){
								currentText = "Flee";
							}
							
							if (fightData.tilePos?.x == -1 || fightData.attackingTilePos?.x != -1){
								if ((arr != null || fightData.tilePos?.x != -1) && !fightData.isFightOver){
									hudButtons.push({
										text: currentText, pos: {x: currentEnemyPos.x, y: currentEnemyPos.y + 0.175*1.75, w: 0.4, h: 0.175}, textSize: 0.3,
										color: "#222222", textColor: rarityColor,
										downscaleTextLength: 5, drawLayer: 2, onclick: ["startFight"]
									});
									
									hudButtons.push({
										text: "lv "+enemyLevel, pos: {x: currentEnemyPos.x, y: currentEnemyPos.y - 0.26, w: 0.4, h: 0.175}, textSize: 0.3,
										textColor: "#ffffff", outlineColor: rarityColor,
										outlineSize: 0.005, downscaleTextLength: 5, drawLayer: 3, ...gamePresets.textButton
									});
									
									for (let i in alliesPos){
										let currentLevel = allyLevels[i];
										
										if (currentLevel > 0 || developmentMode){
											/*let currentRarityColor = rarityColors[((fightData.attackingTilePos.x == -1) ? i : fightData.attackingPlantNum)];*/
											hudButtons.push({
												text: "lv "+currentLevel, pos: {x: alliesPos[i].x, y: alliesPos[i].y - 0.26, w: 0.4, h: 0.175}, textSize: 0.3,
												textColor: "#ffffff", outlineColor: "#000000", outlineSize: 0.005, downscaleTextLength: 5, drawLayer: 0, ...gamePresets.textButton
											});
										}
									}
								}
							} else{
								hudButtons.push({
									text: "Cancel Selection", pos: {x: 0.5, y: 0.9, w: 0.15, h: 0.05}, textSize: 0.3, isAbsolutePositioned: true,
									color: "#222222", textColor: "#ffffff", downscaleTextLength: 5, drawLayer: 4,
									onclick: ["<<fightData.attackingTilePos.x = 0;>>", "startFight"],
								});
							}
							
							
							/*Plant selection against enemy plant*/
							if (fightData.tilePos.x != -1 && fightData.attackingTilePos.x == -1){
								for (let i in plantEntities){
									let gridPos = plantEntities[i].pos;
									let pos = getGridTilePos(gridPos);
									
									let currentPos = {
										x: pos.x + 0.2 * pos.w,
										y: pos.y + 0.5 * pos.h
									};
									
									let currentArr = plantOccurencesGrid[gridPos.y][gridPos.x];
									
									for (let j in currentArr){
										let currentLevel = currentArr[j].level;
										
										if (currentLevel > 0 || developmentMode){
											let currentSprite = (hiddenPlants[currentArr[j].name]) ? gameSprites.questionMark : (gameSprites[currentArr[j].name] ?? gameSprites[defaultPlantName]);
											
											hudButtons.push({
												text: "🕴\\n", subtext: currentLevel, subtextPos: {x: 0, y: 0.25},
												sprites: [{...(currentSprite), shadowColor: ["#ffffff", "#000000"], shadowPos: [{x: -0.003, y: -0.003}, {x: 0.003, y: 0.003}]}],
												pos: {x: currentPos.x, y: currentPos.y, w: 0.5, h: 1.5}, textSize: 1, subtextSize: 1,
												color: "#222222", textColor: rarityColors[j], downscaleSubtextLength: 1, drawLayer: 3,
												borderColor: rarityColors[j], borderSize: 0.01,
												onclick: ["<<runEvent('selectAttackerPlant', {pos: {x: "+gridPos.x+", y: "+gridPos.y+"}, i: "+j+"});>>"],
											});
										}
										
										currentPos.x += 0.3 * pos.w;
									}
								}
							} else{
								/*Fight Hud*/
								if (fightData.plantValues != undefined){
									let enemyArr = fightData.plantValues;
									let enemyName = plantsData[enemyArr.name].name;
									let allyArr = fightData.attackingPlantValues;
									let allyName = plantsData[allyArr.name].name;
									
									hudButtons.push({
										text: "Enemy Plant: "+enemyName+" (lv "+enemyArr.level+")\\n"+ "Health: "+getNumWithTruncatedDecimals(enemyArr.health*100, 2),
										pos: {x: 0.8, y: 0.3, w: 0.2, h: 0.15}, textSize: 0.3, isAbsolutePositioned: true,
										color: "#ffffff", textColor: "#000000", downscaleTextLength: 5, drawLayer: 3, disableClick: true
									});
									
									hudButtons.push({
										text: "Ally Plant: "+allyName+" (lv "+allyArr.level+")\\n"+ "Health: "+getNumWithTruncatedDecimals(allyArr.health*100, 2),
										pos: {x: 0.2, y: 0.3, w: 0.2, h: 0.15}, textSize: 0.3, isAbsolutePositioned: true,
										color: "#ffffff", textColor: "#000000", downscaleTextLength: 5, drawLayer: 3, disableClick: true
									});
									
									
									let fightSides = [{attacks: plantsData[allyArr.name].attackTypes}, {attacks: plantsData[enemyArr.name].attackTypes}];
									for (let j = 0; j < fightSides.length; j++){
										let currentAttacks = fightSides[j].attacks;
										
										for (let i = 0; i < currentAttacks.length; i++){
											let attackName = currentAttacks[i];
											
											let isAttack = plantAttackTypes[attackName].isAttack;
											let currentName = attackName + ((isAttack) ? " attack" : " boost");
											
											hudButtons.push({
												text: currentName, pos: {x: 0.2 + (j*0.6) + (Math.max(i-3, 0)*0.175*(j > 0 ? -1 : 1)), y: 0.5 + Math.min(i, 3)*0.15, w: 0.15, h: 0.1}, textSize: 0.3, isAbsolutePositioned: true,
												color: "#ffffff", textColor: "#000000", downscaleTextLength: 5, drawLayer: 3,
												isLocked: fightData.isFightOver || j > 0,
												onclick: ["<<runEvent('attackPlant', {attackName: '"+attackName+"'})>>"],
											});
										}
									}
									
									
									hudButtons.push({
										text: fightData.attackLogText ?? "",
										pos: {x: 0.5, y: 0.1, w: 0.8, h: 0.2}, textSize: 0.08, isAbsolutePositioned: true,
										color: "#ffffff88", textColor: "#000000", downscaleTextLength: 20, drawLayer: 3, disableClick: true
									});
									
									if (fightData.isFightOver){
										let currentSubtext = (fightData.levelGain != undefined) ? enemyName+" gained "+fightData.levelGain+" level"+((fightData.levelGain>1)?"s":"")+"!" : "loss :(";
										hudButtons.push({
											text: "Finish Fight",
											pos: {x: 0.5, y: 0.75, w: 0.2, h: 0.15}, textSize: 0.3, isAbsolutePositioned: true,
											subtext: currentSubtext,
											subtextPos: {x: 0, y: 0.33}, subtextSize: 0.05,
											color: "#ffffff", textColor: "#000000", downscaleTextLength: 5, downscaleSubtextLength: 30, drawLayer: 3, onclick: ["finishFight"]
										});
										
									}
								}
							}
							
							
							buttons.game = [
								...hudButtons,
								
								{text: "Plants Info", pos: {x: 0.95, y: 0.15, w: 0.05, h: 0.05}, textSize: 0.15, isAbsolutePositioned: true,
									color: "#222222", textColor: "#ffffff", drawLayer: 10, onclick: ["togglePlantsInfo"]},
									
								{text: "Citation", pos: {x: 0.95, y: 0.95, w: 0.05, h: 0.05}, textSize: 0.15, isAbsolutePositioned: true,
									color: "#222222", textColor: "#ffffff", drawLayer: 10, onclick: ["toggleCitation"]},
								
								
								{...gamePresets.quitButton, drawLayer: 10}
							];
						}>>`],
						
						toggleCitation: [`<<{
							gameState.currentState = (gameState.currentState != "citation") ? "citation" : "game";
						}>>`],
						togglePlantsInfo: [`<<{
							gameState.currentState = (gameState.currentState != "plantsInfo") ? "plantsInfo" : "game";
							
							runEvent("refreshPlantsInfo");
						}>>`],
						refreshPlantsInfo: [`<<{
							if (gameState.currentState == "plantsInfo"){
								let buttonsArr = [];
								
								let alphabeticalPlantNames = [];
								let scientificNames = {};
								
								for (let i in plantsData){
									alphabeticalPlantNames.push(plantsData[i].name);
									scientificNames[plantsData[i].name] = i;
								}
								alphabeticalPlantNames.sort();
								
								for (let i = 0; i < alphabeticalPlantNames.length; i++){
									let currentPlant = scientificNames[alphabeticalPlantNames[i]];
									
									let currentColor = "#ffffff";/*plantTypes[plantsData[currentPlant].type].color;*/
									
									if (plantInfoSelectedAttack != ""){
										currentColor = (plantsData[currentPlant].attackTypes.includes(plantInfoSelectedAttack)) ? "#ffffff" : colors.grayedOut;
									}
									if (plantInfoSelectedPlant != ""){
										currentColor = (plantInfoSelectedPlant == currentPlant) ? "#ffffff" : colors.grayedOut;
									}
									
									let isHidden = (hiddenPlants[currentPlant]);
									
									let currentText = (isHidden) ? "???" : (plantInfoSpritesMode ? "🕴" : plantsData[currentPlant].name.replaceAll(" ", "\\n"));
									
									let currentSprite = [];
									
									if (plantInfoSpritesMode){
										currentSprite = (hiddenPlants[currentPlant]) ? gameSprites.questionMark : (gameSprites[currentPlant] ?? gameSprites[defaultPlantName]);
									
										currentSprite = [{...(currentSprite), shadowColor: ["#000000"], shadowPos: [{x: 0.005, y: 0.005}]}];
									}
									
									buttonsArr.push({
										text: currentText, pos: {x: 0.225 + 0.05*(i%14), y: 0.24 + 0.06*Math.floor(i/14), w: 0.05, h: 0.06}, sprites: currentSprite,
										textSize: 0.14 + 0.5*(plantInfoSpritesMode&&!hiddenPlants[currentPlant]), marginY: 0.075, downscaleTextLength: 11, isAbsolutePositioned: true,
										color: currentColor, borderSize: 0.0005, isLocked: isHidden,
										onclick: ["<<plantInfoSelectedPlant = (plantInfoSelectedPlant != '"+currentPlant+"') ? '"+currentPlant+"' : ''; plantInfoSelectedAttack='';>>", "refreshPlantsInfo"],
									});
								}
								
								let indexNum = 0;
								let currentSpan = 0;
								for (let i in plantAttackTypes){
									let currentPlant = scientificNames[alphabeticalPlantNames[i]];
									
									let currentColor = "#ffffff";
									
									if (plantInfoSelectedPlant != ""){
										currentColor = (plantsData[plantInfoSelectedPlant].attackTypes.includes(i)) ? "#ffffff" : colors.grayedOut;
									}
									if (plantInfoSelectedAttack != ""){
										currentColor = (plantInfoSelectedAttack == i) ? "#ffffff" : colors.grayedOut;
									}
									
									buttonsArr.push({
										text: i, pos: {x: 0.1, y: 0.05 + 0.04*indexNum + 0.02*currentSpan, w: 0.1, h: 0.04},
										textSize: 0.14, marginY: 0.075, downscaleTextLength: 11, isAbsolutePositioned: true, color: currentColor, borderSize: 0.001,
										onclick: ["<<plantInfoSelectedAttack = (plantInfoSelectedAttack != '"+i+"') ? '"+i+"' : ''; plantInfoSelectedPlant='';>>", "refreshPlantsInfo"],
									});
									indexNum++;
									if (indexNum >= 7){
										currentSpan = 1;
									}
								}
								
								let descriptionText = "";
								let currentSprite = [];
								
								if (plantInfoSelectedAttack != ""){
									if (plantAttackTypes[plantInfoSelectedAttack]?.text != undefined){
										descriptionText += plantInfoSelectedAttack + " boost: " + plantAttackTypes[plantInfoSelectedAttack].text;
									} else{
										descriptionText += plantInfoSelectedAttack + " attack type advantages:\\n";
										
										let currentTypeIndex = plantTypeAdvantages.typesIndex.indexOf(plantInfoSelectedAttack);
										
										for (let i in plantTypeAdvantages.values[currentTypeIndex]){
											descriptionText += (plantTypeAdvantages.values[currentTypeIndex][i]*100) + "% " + plantTypeAdvantages.typesIndex[i];
											
											if (i != plantTypeAdvantages.values[currentTypeIndex].length - 1){
												descriptionText += ", ";
											}
										}
									}
								} else if (plantInfoSelectedPlant != ""){
									descriptionText += "🕴 " + plantsData[plantInfoSelectedPlant].name + " (" + plantInfoSelectedPlant + ") 🕴";
									
									currentSprite = (hiddenPlants[plantInfoSelectedPlant]) ? gameSprites.questionMark : (gameSprites[plantInfoSelectedPlant] ?? gameSprites[defaultPlantName]);
									
									currentSprite = [{...(currentSprite), shadowColor: ["#000000"], shadowPos: [{x: 0.005, y: 0.005}]}];
								}
								
								buttonsArr.push({
									text: descriptionText, pos: {x: 0.55, y: 0.1, w: 0.6, h: 0.15}, sprites: currentSprite,
									textSize: 0.1375, marginY: 0.125, downscaleTextLength: 11, isAbsolutePositioned: true,
									disableClick: true,
								});
								
								buttons.plantsInfo = [
									...buttonsArr,
									
									{text: "Back", pos: {x: 0.95, y: 0.15, w: 0.05, h: 0.05}, textSize: 0.15, isAbsolutePositioned: true,
										color: "#222222", textColor: "#ffffff", drawLayer: 2, onclick: ["togglePlantsInfo"]},
										
										
									{text: "Icons: "+(plantInfoSpritesMode ? "on" : "off"), pos: {x: 0.95, y: 0.3, w: 0.05, h: 0.05}, textSize: 0.15, isAbsolutePositioned: true,
										color: "#222222", textColor: "#ffffff", drawLayer: 2, onclick: ["<<plantInfoSpritesMode = !plantInfoSpritesMode;>>", "refreshPlantsInfo"]},
										
									{text: "Citation", pos: {x: 0.95, y: 0.95, w: 0.05, h: 0.05}, textSize: 0.15, isAbsolutePositioned: true,
										color: "#222222", textColor: "#ffffff", drawLayer: 10, onclick: ["toggleCitation"]},
									
									{...gamePresets.quitButton}
								];
							}
						}>>`],
					},
					
					fightEvents: {
						startFight: [`<<{
							let pos = getVertexPositionInGrid(entities[0].pos);
							
							let arr = plantOccurencesGrid[pos.y]?.[pos.x];
							
							
							if (hasStarterPlant){
								
								if (fightData.attackingTilePos?.x != -1){
									let savePlantPos = fightData.tilePos;
									
									fightData = {tilePos: {x: -1, y: -1}, attackingTilePos: {x: -1, y: -1}, attackingPlantNum: 0};
									
									runEvent("refreshPlantEntities", {savePlantPos: savePlantPos});
								} else{
									let currentEnemyValues = {name: "", level: 1};
									
									for (let i in entities){
										if (entities[i].plantPos?.x == pos.x && entities[i].plantPos?.y == pos.y && !entities[i].isAlly){
											currentEnemyValues = {name: entities[i].plantName, level: entities[i].plantLevel, health: 1, plantNum: entities[i].plantNum};
											
											hiddenPlants[currentEnemyValues.name] = false;
										}
									}
									
									fightData = {tilePos: {x: pos.x, y: pos.y}, attackingTilePos: {x: -1, y: -1}, attackingPlantNum: 0, plantValues: currentEnemyValues};
								}
							} else{
								arr[0].level = 5;
								hiddenPlants[arr[0].name] = false;
								
								hasStarterPlant = true;
								
								runEvent("refreshPlantEntities");
							}
						}>>`],
						
						selectAttackerPlant: [`<<{
							fightData.attackingTilePos = args.pos;
							fightData.attackingPlantNum = args.i;
							
							let currentPlant = plantOccurencesGrid[args.pos.y][args.pos.x][args.i];
							
							fightData.attackingPlantValues = {name: currentPlant.name, level: currentPlant.level, health: 1};
							
							runEvent("refreshHudButtons");
						}>>`],
						
						attackPlant: [`<<
							let attackName = args.attackName;
							let isEnemyAttack = args.isEnemyAttack;
							
							let attackArr = plantAttackTypes[attackName];
							
							let isFightOver = false;
							
							let attackLogText = (isEnemyAttack) ? fightData.attackLogText + "\\n" : "";
							
							let currentPlantValues = (isEnemyAttack) ? "plantValues" : "attackingPlantValues";
							let opponentPlantValues = (isEnemyAttack) ? "attackingPlantValues" : "plantValues";
							
							let currentPlantName = fightData[currentPlantValues].name;
							let opponentPlantName = fightData[opponentPlantValues].name;
							
							let currentPlantType = plantsData[currentPlantName].type;
							let opponentPlantType = plantsData[opponentPlantName].type;
							let currentPlantTypeIndex = plantTypeAdvantages.typesIndex.indexOf(currentPlantType);
							let opponentPlantTypeIndex = plantTypeAdvantages.typesIndex.indexOf(opponentPlantType);
							let typeAdvantageMultiplier = plantTypeAdvantages.values[currentPlantTypeIndex][opponentPlantTypeIndex];
							
							if (attackArr.isAttack){ /*Plant attack*/
								let boostMultiplier = fightData[currentPlantValues].boostMultiplier ?? 1;
								let levelBuff = fightData[currentPlantValues].level;
								let opponentLevelDebuff = (1/fightData[opponentPlantValues].level);
								
								let distanceMultiplier = 1;
								let distanceNum = getVertexDistance(fightData.tilePos, fightData.attackingTilePos);
								distanceMultiplier = Math.min(2 / (distanceNum**2 + 1), 1);
								if (isEnemyAttack){ distanceMultiplier = 1/distanceMultiplier; }
								
								let currentAttackAmount = 0.125 * levelBuff * opponentLevelDebuff * distanceMultiplier * boostMultiplier * typeAdvantageMultiplier;
								fightData[opponentPlantValues].health -= currentAttackAmount;
								
								attackLogText += plantsData[currentPlantName].name + " attacked for "+getNumWithTruncatedDecimals(currentAttackAmount*100, 2)+" damage (multipliers: ";
								attackLogText += getNumWithTruncatedDecimals(boostMultiplier*100, 0) + "% boost, ";
								attackLogText += getNumWithTruncatedDecimals(levelBuff * opponentLevelDebuff*100, 0) + "% level, ";
								attackLogText += getNumWithTruncatedDecimals(typeAdvantageMultiplier*100, 0) + "% type, ";
								attackLogText += getNumWithTruncatedDecimals(distanceMultiplier*100, 0) + "% distance)";
								
								if (fightData[opponentPlantValues].health <= 0){
									if (!isEnemyAttack){
										let tileArr = plantOccurencesGrid[fightData.tilePos.y][fightData.tilePos.x];
										let enemyPlantNum = 0;
										for (let i = 0; i < tileArr.length; i++){
											if (tileArr[i].name == fightData.plantValues.name){
												enemyPlantNum = i;
											}
										}
										
										let levelGain = Math.max(Math.round((fightData.plantValues.level-tileArr[enemyPlantNum].level)/2), 1);
										tileArr[enemyPlantNum].level += levelGain;
										
										fightData.levelGain = levelGain;
									}
									
									isFightOver = true;
								}
							} else{ /*Plant boost*/
								fightData[currentPlantValues].boostMultiplier ??= 1;
								
								if (plantAttackTypes[attackName].value == "lowerOpponentBoosts"){
									fightData[opponentPlantValues].boostMultiplier ??= 1;
									fightData[opponentPlantValues].boostMultiplier *= (2/3);
									
									attackLogText += plantsData[currentPlantName].name + " used "+attackName+" boost, lowering their opponent's boost by 66% to ";
									attackLogText += getNumWithTruncatedDecimals(fightData[opponentPlantValues].boostMultiplier * 100, 0) + "%";
								} else{
									if (plantAttackTypes[attackName].value == "randomBoost"){
										while (plantAttackTypes[attackName].value == "randomBoost" || plantAttackTypes[attackName].isAttack){
											attackName = getRandomElementNameOfObject(plantAttackTypes);
										}
									}
									
									let opponentMoves = plantsData[fightData[opponentPlantValues].name].attackTypes;
									let plantsAmount = 0;
									
									for (let i in plantOccurencesGrid){
										for (let j in plantOccurencesGrid[i]){
											for (let k in plantOccurencesGrid[i][j]){
												if (plantOccurencesGrid[i][j][k].level > 0){
													plantsAmount++;
												}
											}
										}
									}
									
									let boostArgs = {
										isOpponentPentapetalae: !opponentMoves.includes("Anti-Pentapetalae"),
										opponentName: plantsData[fightData[opponentPlantValues].name].name,
										opponentLevel: fightData[opponentPlantValues].level,
										plantDistance: getVertexDistance(fightData.tilePos, fightData.attackingTilePos),
										isOpponentAnimalistic: opponentMoves.includes("Animalistic"),
										typeAdvantageAmount: typeAdvantageMultiplier,
										boostAmount: (fightData[currentPlantValues].boostMultiplier ?? 1),
										opponentBoostAmount: (fightData[opponentPlantValues].boostMultiplier ?? 1),
										plantsAmount: ((isEnemyAttack) ? 1 : plantsAmount),
									};
									
									let currentMultiplier = 1.5;
									
									if (plantAttackTypes[attackName].value != undefined){
										currentMultiplier = runEval({text: "Math.max("+plantAttackTypes[attackName].value+", 1)", ...boostArgs});
									}
									
									fightData[currentPlantValues].boostMultiplier *= currentMultiplier;
									
									attackLogText += plantsData[currentPlantName].name + " used "+attackName+" boost, raising their boost by ";
									attackLogText += getNumWithTruncatedDecimals(currentMultiplier * 100, 0) + "% to ";
									attackLogText += getNumWithTruncatedDecimals(fightData[currentPlantValues].boostMultiplier * 100, 0) + "%";
								}
							}
							
							fightData.attackLogText = attackLogText;
							
							if (isFightOver){
								fightData.isFightOver = true;
							} else{
								if (!isEnemyAttack){
									runEvent("attackPlant", {isEnemyAttack: true, attackName: getRandomElementOfArray(plantsData[fightData.plantValues.name].attackTypes)});
								}
							}
						>>`],
						finishFight: [`<<{
							fightData = {tilePos: {x: -1, y: -1}, attackingTilePos: {x: -1, y: -1}, attackingPlantNum: 0};
							runEvent("refreshPlantEntities");
						}>>`],
					},
				},
				
				gridNames: ["mainGrid"],
				
				buttons: {
					game: [
						{...gamePresets.quitButton}
					],
					citation: [
						{...gamePresets.quitButton},
						{text: "Plants Info", pos: {x: 0.95, y: 0.15, w: 0.05, h: 0.05}, textSize: 0.15, isAbsolutePositioned: true,
								color: "#222222", textColor: "#ffffff", drawLayer: 10, onclick: ["togglePlantsInfo"]},
						{text: "Back", pos: {x: 0.95, y: 0.95, w: 0.05, h: 0.05}, textSize: 0.15, isAbsolutePositioned: true,
								color: "#222222", textColor: "#ffffff", drawLayer: 10, onclick: ["toggleCitation"]},
						
						{text: "Map of most commonly observed plants is from Pl@ntNet, citation:\n\nAFFOUARD A, JOLY A, LOMBARDO J, CHAMP J, GOEAU H, CHOUET M, GRESSE H, BOTELLA C,\nBONNET P (2023). Pl@ntNet automatically identified occurrences. Version 1.8. Pl@ntNet.\nOccurrence dataset https://doi.org/10.15468/mma2ec accessed via GBIF.org on 2026-08-21.",
						pos: {x: 0.5, y: 0.5, w: 0.75, h: 0.75}, textSize: 0.28, downscaleTextLength: 6, isAbsolutePositioned: true,
								drawLayer: 10, onclick: ["<<window.open('https://doi.org/10.15468/mma2ec')>>"]},
					],
				},
				entities: [
					{
						pos: {x: 0, y: 0.2, w: 0.09, shape: "circle"}, hitboxShape: "circle", isPlayer: true, isStoppedByWalls: true,
						speed: 0.01625, runMultiplier: 3, color: "#ffffff", drawLayer: 1, gameState: "game", shouldFocusCamera: true, isTouchScreenControlled: true
					},
				],
			},
			createdVariables: {
				developmentMode: false,
				
				plantEntities: [],
				
				fightData: {tilePos: {x: -1, y: -1}, attackingTilePos: {x: -1, y: -1}, attackingPlantNum: 0},
				hasStarterPlant: false,
				
				defaultPlantName: "questionMark",
				rarityColors: colors.pan,//["#ff88ff", "#ffff88", "#88ffff"],
				
				plantOccurencesGrid: [[null,null,null,null,[{name:"Eriophorum scheuchzeri",amount:1}],null,null,null,[{name:"Empetrum nigrum",amount:3},{name:"Rhododendron lapponicum",amount:3},{name:"Diapensia lapponica",amount:3}],null,null,[{name:"Cornus suecica",amount:1745},{name:"Empetrum nigrum",amount:594},{name:"Rubus chamaemorus",amount:317}],[{name:"Cornus suecica",amount:76},{name:"Empetrum nigrum",amount:52},{name:"Rubus chamaemorus",amount:10}],[{name:"Saxifraga oppositifolia",amount:1},{name:"Silene acaulis",amount:1},{name:"Eriophorum scheuchzeri",amount:1}],[{name:"Vaccinium vitis-idaea",amount:4},{name:"Empetrum nigrum",amount:3},{name:"Caltha palustris",amount:3}],null,[{name:"Tephroseris palustris",amount:3}],null,[{name:"Dryas octopetala",amount:1}]],[null,null,[{name:"Achillea millefolium",amount:1},{name:"Parnassia palustris",amount:1},{name:"Rubus arcticus",amount:1}],[{name:"Cornus canadensis",amount:268},{name:"Oplopanax horridus",amount:186},{name:"Rosa rugosa",amount:92}],[{name:"Cornus canadensis",amount:417},{name:"Actaea rubra",amount:167},{name:"Tanacetum vulgare",amount:155}],[{name:"Cornus canadensis",amount:44},{name:"Aralia nudicaulis",amount:13},{name:"Apocynum androsaemifolium",amount:12}],[{name:"Vaccinium uliginosum",amount:3},{name:"Cornus canadensis",amount:2},{name:"Rubus chamaemorus",amount:2}],[{name:"Cornus canadensis",amount:8},{name:"Empetrum nigrum",amount:6},{name:"Alnus alnobetula",amount:3}],[{name:"Bartsia alpina",amount:3},{name:"Angelica archangelica",amount:3},{name:"Oxyria digyna",amount:2}],[{name:"Empetrum nigrum",amount:467},{name:"Gunnera tinctoria",amount:413},{name:"Bartsia alpina",amount:315}],[{name:"Alliaria petiolata",amount:28218},{name:"Glechoma hederacea",amount:17986},{name:"Fagus sylvatica",amount:15392}],[{name:"Alliaria petiolata",amount:15344},{name:"Chelidonium majus",amount:12587},{name:"Prunus padus",amount:10378}],[{name:"Glechoma hederacea",amount:1444},{name:"Aegopodium podagraria",amount:1229},{name:"Filipendula ulmaria",amount:1170}],[{name:"Glechoma hederacea",amount:280},{name:"Leonurus cardiaca",amount:260},{name:"Acer negundo",amount:205}],[{name:"Leonurus cardiaca",amount:133},{name:"Glechoma hederacea",amount:125},{name:"Berteroa incana",amount:82}],[{name:"Filipendula ulmaria",amount:66},{name:"Glechoma hederacea",amount:61},{name:"Galium verum",amount:51}],[{name:"Prunus padus",amount:9},{name:"Parnassia palustris",amount:7},{name:"Vaccinium vitis-idaea",amount:7}],[{name:"Rubus arcticus",amount:6},{name:"Tanacetum vulgare",amount:4},{name:"Cornus suecica",amount:4}],[{name:"Fritillaria camschatcensis",amount:6},{name:"Silene vulgaris",amount:6},{name:"Rubus arcticus",amount:4}]],[null,null,null,[{name:"Gaultheria shallon",amount:4242},{name:"Prunus laurocerasus",amount:2654},{name:"Rubus spectabilis",amount:1771}],[{name:"Ribes aureum",amount:849},{name:"Asclepias speciosa",amount:793},{name:"Rhamnus cathartica",amount:567}],[{name:"Rhamnus cathartica",amount:9840},{name:"Leonurus cardiaca",amount:6910},{name:"Glechoma hederacea",amount:6889}],[{name:"Alliaria petiolata",amount:13564},{name:"Rhamnus cathartica",amount:10450},{name:"Rubus phoenicolasius",amount:7006}],[{name:"Cornus canadensis",amount:897},{name:"Rosa rugosa",amount:389},{name:"Clintonia borealis",amount:291}],[{name:"Hedychium gardnerianum",amount:905},{name:"Pittosporum undulatum",amount:329},{name:"Gunnera tinctoria",amount:208}],[{name:"Pittosporum tobira",amount:1929},{name:"Eriobotrya japonica",amount:1648},{name:"Pistacia lentiscus",amount:1539}],[{name:"Alliaria petiolata",amount:112417},{name:"Fagus sylvatica",amount:97596},{name:"Pittosporum tobira",amount:80406}],[{name:"Alliaria petiolata",amount:33539},{name:"Glechoma hederacea",amount:32250},{name:"Fagus sylvatica",amount:30443}],[{name:"Elaeagnus angustifolia",amount:914},{name:"Chelidonium majus",amount:865},{name:"Cotinus coggygria",amount:841}],[{name:"Sambucus ebulus",amount:40},{name:"Hyoscyamus niger",amount:40},{name:"Elaeagnus angustifolia",amount:39}],[{name:"Alliaria petiolata",amount:221},{name:"Glechoma hederacea",amount:130},{name:"Acer negundo",amount:128}],[{name:"Glechoma hederacea",amount:78},{name:"Alliaria petiolata",amount:53},{name:"Caltha palustris",amount:28}],[{name:"Prunus padus",amount:18},{name:"Broussonetia papyrifera",amount:15},{name:"Calypso bulbosa",amount:14}],[{name:"Glechoma hederacea",amount:56},{name:"Kerria japonica",amount:49},{name:"Dasiphora fruticosa",amount:36}],[{name:"Houttuynia cordata",amount:42},{name:"Rosa rugosa",amount:36},{name:"Trifolium repens",amount:22}]],[null,null,null,[{name:"Malosma laurina",amount:830},{name:"Ricinus communis",amount:794},{name:"Marrubium vulgare",amount:631}],[{name:"Callicarpa americana",amount:1817},{name:"Calyptocarpus vialis",amount:1213},{name:"Parthenocissus quinquefolia",amount:1177}],[{name:"Callicarpa americana",amount:6747},{name:"Parthenocissus quinquefolia",amount:5870},{name:"Vitis rotundifolia",amount:3895}],[{name:"Callicarpa americana",amount:474},{name:"Vitis rotundifolia",amount:366},{name:"Parthenocissus quinquefolia",amount:337}],null,[{name:"Hedychium gardnerianum",amount:17},{name:"Pittosporum undulatum",amount:9},{name:"Parentucellia viscosa",amount:5}],[{name:"Ricinus communis",amount:1419},{name:"Euphorbia balsamifera",amount:853},{name:"Kleinia neriifolia",amount:757}],[{name:"Pistacia lentiscus",amount:1918},{name:"Ricinus communis",amount:1509},{name:"Ceratonia siliqua",amount:1463}],[{name:"Ceratonia siliqua",amount:1615},{name:"Pistacia lentiscus",amount:1191},{name:"Olea europaea",amount:632}],[{name:"Nerium oleander",amount:856},{name:"Olea europaea",amount:819},{name:"Ceratonia siliqua",amount:779}],[{name:"Calotropis procera",amount:130},{name:"Ficus carica",amount:91},{name:"Nerium oleander",amount:76}],[{name:"Ricinus communis",amount:266},{name:"Parthenium hysterophorus",amount:251},{name:"Cynodon dactylon",amount:207}],[{name:"Parthenium hysterophorus",amount:399},{name:"Psidium guajava",amount:226},{name:"Urena lobata",amount:206}],[{name:"Zephyranthes candida",amount:9},{name:"Broussonetia papyrifera",amount:8},{name:"Nerium oleander",amount:7}],[{name:"Duranta erecta",amount:125},{name:"Broussonetia papyrifera",amount:122},{name:"Sphagneticola trilobata",amount:113}],[{name:"Houttuynia cordata",amount:285},{name:"Iris japonica",amount:213},{name:"Lamium amplexicaule",amount:161}]],[[{name:"Morinda citrifolia",amount:204},{name:"Artocarpus altilis",amount:117},{name:"Sphagneticola trilobata",amount:90}],[{name:"Morinda citrifolia",amount:341},{name:"Carissa macrocarpa",amount:175},{name:"Artocarpus altilis",amount:131}],null,[{name:"Coccoloba uvifera",amount:7},{name:"Russelia equisetiformis",amount:6},{name:"Tecoma stans",amount:4}],[{name:"Duranta erecta",amount:940},{name:"Ricinus communis",amount:766},{name:"Thunbergia alata",amount:452}],[{name:"Coccoloba uvifera",amount:366},{name:"Morinda citrifolia",amount:351},{name:"Duranta erecta",amount:228}],[{name:"Coccoloba uvifera",amount:1925},{name:"Morinda citrifolia",amount:1335},{name:"Thespesia populnea",amount:1252}],null,[{name:"Calotropis procera",amount:35},{name:"Grevillea robusta",amount:11},{name:"Psidium guajava",amount:9}],[{name:"Calotropis procera",amount:135},{name:"Anacardium occidentale",amount:45},{name:"Mangifera indica",amount:41}],[{name:"Azadirachta indica",amount:109},{name:"Mangifera indica",amount:55},{name:"Vitellaria paradoxa",amount:55}],[{name:"Azadirachta indica",amount:49},{name:"Calotropis procera",amount:24},{name:"Mangifera indica",amount:14}],[{name:"Nicotiana glauca",amount:65},{name:"Calotropis procera",amount:47},{name:"Tagetes minuta",amount:28}],[{name:"Calotropis procera",amount:27},{name:"Ricinus communis",amount:11},{name:"Tagetes minuta",amount:9}],[{name:"Sphagneticola trilobata",amount:379},{name:"Parthenium hysterophorus",amount:160},{name:"Acalypha wilkesiana",amount:155}],[{name:"Sphagneticola trilobata",amount:825},{name:"Parthenium hysterophorus",amount:687},{name:"Psidium guajava",amount:354}],[{name:"Asystasia gangetica",amount:130},{name:"Clitoria ternatea",amount:115},{name:"Mimosa pudica",amount:93}],[{name:"Sphagneticola trilobata",amount:219},{name:"Mimosa pudica",amount:122},{name:"Codiaeum variegatum",amount:120}],[{name:"Mimosa pudica",amount:22},{name:"Sphagneticola trilobata",amount:16},{name:"Axonopus compressus",amount:6}],[{name:"Sphagneticola trilobata",amount:8},{name:"Morinda citrifolia",amount:7},{name:"Barringtonia asiatica",amount:7}],[{name:"Crinum asiaticum",amount:1}]],[null,null,null,null,[{name:"Cucumis dipsaceus",amount:11},{name:"Cordia lutea",amount:8},{name:"Conocarpus erectus",amount:6}],[{name:"Thunbergia alata",amount:762},{name:"Duranta erecta",amount:357},{name:"Coffea arabica",amount:212}],[{name:"Mimosa pudica",amount:20},{name:"Caladium bicolor",amount:18},{name:"Turnera subulata",amount:15}],[{name:"Anacardium occidentale",amount:73},{name:"Pilea microphylla",amount:58},{name:"Mimosa pudica",amount:55}],[{name:"Anacardium occidentale",amount:44},{name:"Pilea microphylla",amount:44},{name:"Turnera subulata",amount:37}],[{name:"Heliotropium indicum",amount:4},{name:"Thunbergia erecta",amount:4},{name:"Chromolaena odorata",amount:3}],[{name:"Heliotropium indicum",amount:115},{name:"Laportea aestuans",amount:87},{name:"Euphorbia heterophylla",amount:64}],[{name:"Tithonia diversifolia",amount:50},{name:"Chromolaena odorata",amount:26},{name:"Mimosa pudica",amount:22}],[{name:"Psidium guajava",amount:111},{name:"Grevillea robusta",amount:102},{name:"Duranta erecta",amount:94}],[{name:"Artocarpus altilis",amount:56},{name:"Terminalia catappa",amount:25},{name:"Chrysobalanus icaco",amount:18}],[{name:"Artocarpus altilis",amount:24},{name:"Barringtonia asiatica",amount:20},{name:"Guettarda speciosa",amount:18}],[{name:"Barringtonia asiatica",amount:100},{name:"Mimosa pudica",amount:38},{name:"Calotropis gigantea",amount:25}],[{name:"Sphagneticola trilobata",amount:343},{name:"Dillenia suffruticosa",amount:312},{name:"Mimosa pudica",amount:267}],[{name:"Mimosa pudica",amount:66},{name:"Codiaeum variegatum",amount:45},{name:"Clitoria ternatea",amount:38}],[{name:"Codiaeum variegatum",amount:28},{name:"Mimosa pudica",amount:27},{name:"Axonopus compressus",amount:19}],[{name:"Codiaeum variegatum",amount:3},{name:"Dendrobium macrophyllum",amount:2},{name:"Melochia corchorifolia",amount:2}],[{name:"Tristellateia australasiae",amount:1},{name:"Sphagneticola trilobata",amount:1},{name:"Ricinus communis",amount:1}],[{name:"Ricinus communis",amount:1},{name:"Premna serratifolia",amount:1}]],[[{name:"Artocarpus altilis",amount:1},{name:"Morinda citrifolia",amount:1},{name:"Hibiscus × rosa-sinensis",amount:1}],[{name:"Morinda citrifolia",amount:117},{name:"Gardenia taitensis",amount:105},{name:"Artocarpus altilis",amount:58}],[{name:"Morinda citrifolia",amount:14},{name:"Gardenia taitensis",amount:4},{name:"Artocarpus altilis",amount:4}],null,null,[{name:"Nicandra physalodes",amount:65},{name:"Plantago major",amount:65},{name:"Plumbago auriculata",amount:53}],[{name:"Lobularia maritima",amount:35},{name:"Heliotropium indicum",amount:35},{name:"Nicotiana glauca",amount:34}],[{name:"Psidium guajava",amount:342},{name:"Anacardium occidentale",amount:239},{name:"Pilea microphylla",amount:192}],[{name:"Anacardium occidentale",amount:152},{name:"Centratherum punctatum",amount:139},{name:"Pilea microphylla",amount:117}],null,null,[{name:"Mangifera indica",amount:15},{name:"Colophospermum mopane",amount:11},{name:"Duranta erecta",amount:11}],[{name:"Psidium guajava",amount:75},{name:"Mangifera indica",amount:55},{name:"Duranta erecta",amount:37}],[{name:"Duranta erecta",amount:22},{name:"Barringtonia asiatica",amount:22},{name:"Cajanus cajan",amount:21}],[{name:"Ipomoea pes-caprae",amount:3},{name:"Hibiscus × rosa-sinensis",amount:2},{name:"Mimosa pudica",amount:1}],null,[{name:"Axonopus compressus",amount:111},{name:"Manihot esculenta",amount:88},{name:"Mimosa pudica",amount:81}],[{name:"Mimosa pudica",amount:226},{name:"Codiaeum variegatum",amount:169},{name:"Calotropis gigantea",amount:168}],[{name:"Morinda citrifolia",amount:30},{name:"Calotropis procera",amount:28},{name:"Cassia fistula",amount:11}],[{name:"Codiaeum variegatum",amount:54},{name:"Ardisia elliptica",amount:38},{name:"Xanthostemon chrysanthus",amount:37}],[{name:"Carica papaya",amount:4},{name:"Morinda citrifolia",amount:4},{name:"Pandanus belepensis",amount:4}],[{name:"Morinda citrifolia",amount:9},{name:"Alpinia purpurata",amount:8},{name:"Barringtonia asiatica",amount:8}]],[[{name:"Morinda citrifolia",amount:8},{name:"Alpinia purpurata",amount:5},{name:"Gardenia taitensis",amount:2}],[{name:"Morinda citrifolia",amount:1},{name:"Manihot esculenta",amount:1}],null,[{name:"Leucaena leucocephala",amount:4},{name:"Psidium guajava",amount:3},{name:"Dodonaea viscosa",amount:1}],null,[{name:"Solanum marginatum",amount:1}],[{name:"Passiflora caerulea",amount:835},{name:"Melissa officinalis",amount:552},{name:"Ricinus communis",amount:552}],[{name:"Psidium guajava",amount:1850},{name:"Sphagneticola trilobata",amount:1390},{name:"Eriobotrya japonica",amount:1385}],null,null,null,[{name:"Carissa macrocarpa",amount:105},{name:"Leucospermum cordifolium",amount:78},{name:"Polygala myrtifolia",amount:74}],[{name:"Tagetes minuta",amount:157},{name:"Solanum mauritianum",amount:123},{name:"Solanum pseudocapsicum",amount:109}],[{name:"Hedychium gardnerianum",amount:1182},{name:"Solanum mauritianum",amount:966},{name:"Coccoloba uvifera",amount:867}],null,null,null,[{name:"Arctotheca calendula",amount:149},{name:"Zantedeschia aethiopica",amount:71},{name:"Chamelaucium uncinatum",amount:54}],[{name:"Arctotheca calendula",amount:104},{name:"Prunus persica",amount:74},{name:"Enchylaena tomentosa",amount:52}],[{name:"Pittosporum undulatum",amount:704},{name:"Rhaphiolepis indica",amount:616},{name:"Solanum mauritianum",amount:467}],[{name:"Passiflora edulis",amount:45},{name:"Rivina humilis",amount:44},{name:"Morinda citrifolia",amount:42}],[{name:"Urena lobata",amount:2},{name:"Passiflora foetida",amount:1},{name:"Ipomoea pes-caprae",amount:1}]],[null,null,null,null,null,null,[{name:"Rhaphithamnus spinosus",amount:357},{name:"Berberis darwinii",amount:329},{name:"Gevuina avellana",amount:275}],[{name:"Acacia longifolia",amount:112},{name:"Marrubium vulgare",amount:83},{name:"Grevillea robusta",amount:66}],null,null,null,null,null,null,null,null,null,[{name:"Billardiera heterophylla",amount:9},{name:"Banksia praemorsa",amount:5},{name:"Agonis flexuosa",amount:4}],[{name:"Pittosporum undulatum",amount:907},{name:"Arctotheca calendula",amount:615},{name:"Coprosma repens",amount:341}],[{name:"Pittosporum undulatum",amount:92},{name:"Fatsia japonica",amount:76},{name:"Lamium galeobdolon",amount:73}],[{name:"Eriobotrya japonica",amount:240},{name:"Fatsia japonica",amount:239},{name:"Pittosporum crassifolium",amount:210}]],[null,null,null,null,null,null,[{name:"Gaultheria mucronata",amount:33},{name:"Embothrium coccineum",amount:32},{name:"Chiliotrichum diffusum",amount:29}],[{name:"Chiliotrichum diffusum",amount:1}]]],
				
				plantsData: {"Euphorbia heterophylla":{name:"Mexican fireplant",type:"rosids"},"Gunnera tinctoria":{name:"Giant rhubarb",type:"neutral",isPentapetalae:false},"Aegopodium podagraria":{name:"Ground elder",type:"asterids"},"Angelica archangelica":{name:"Garden angelica",type:"asterids"},"Aralia nudicaulis":{name:"Wild sarsaparilla",type:"asterids"},"Fatsia japonica":{name:"Japanese fatsia",type:"asterids"},"Oplopanax horridus":{name:"Devil's club",type:"asterids"},"Billardiera heterophylla":{name:"Bluebell Creeper",type:"asterids"},"Pittosporum crassifolium":{name:"Karo",type:"asterids"},"Pittosporum tobira":{name:"Australian laurel",type:"asterids"},"Pittosporum undulatum":{name:"Australian cheesewood",type:"asterids"},"Tanacetum vulgare":{name:"Common tansy",type:"asterids"},"Achillea millefolium":{name:"Common yarrow",type:"asterids"},"Chiliotrichum diffusum":{name:"Fachine",type:"asterids"},"Chromolaena odorata":{name:"Siam weed",type:"asterids"},"Calyptocarpus vialis":{name:"Creeping Cinderella weed",type:"asterids"},"Parthenium hysterophorus":{name:"Santa Maria feverfew",type:"asterids"},"Sphagneticola trilobata":{name:"Bay Biscayne Creeping Oxeye",type:"asterids"},"Tithonia diversifolia":{name:"Mexican Sunflower",type:"asterids"},"Tagetes minuta":{name:"Muster John Henry",type:"asterids"},"Kleinia neriifolia":{name:"Canary Islands Candle Plant",type:"asterids"},"Tephroseris palustris":{name:"Marsh fleabane",type:"asterids"},"Arctotheca calendula":{name:"Cape marigold",type:"asterids"},"Centratherum punctatum":{name:"Larkdaisy",type:"asterids"},"Sambucus ebulus":{name:"Dwarf elder",type:"asterids"},"Cornus canadensis":{name:"Bunchberry dogwood",type:"asterids"},"Cornus suecica":{name:"Dwarf cornel",type:"asterids"},"Diapensia lapponica":{name:"Pincushion Plant",type:"asterids"},"Empetrum nigrum":{name:"Black crowberry",type:"asterids"},"Rhododendron lapponicum":{name:"Lapland rosebay",type:"asterids"},"Gaultheria mucronata":{name:"Prickly Heath",type:"asterids"},"Gaultheria shallon":{name:"Salal",type:"asterids"},"Vaccinium uliginosum":{name:"Bog bilberry",type:"asterids"},"Vaccinium vitis-idaea":{name:"Cowberry",type:"asterids"},"Barringtonia asiatica":{name:"Fish poison tree",type:"asterids"},"Ardisia elliptica":{name:"Shoebutton",type:"asterids"},"Vitellaria paradoxa":{name:"Shea Butter Tree",type:"asterids"},"Cordia lutea":{name:"Yellow cordia",type:"asterids"},"Heliotropium indicum":{name:"Indian heliotrope",type:"asterids"},"Apocynum androsaemifolium":{name:"Spreading dogbane",type:"asterids"},"Nerium oleander":{name:"Oleander",type:"asterids"},"Asclepias speciosa":{name:"Showy milkweed",type:"asterids"},"Calotropis gigantea":{name:"Giant Milkweed",type:"asterids"},"Calotropis procera":{name:"Sodom apple",type:"asterids"},"Carissa macrocarpa":{name:"Natal Plum",type:"asterids"},"Guettarda speciosa":{name:"Beach Gardenia",type:"asterids"},"Coffea arabica":{name:"Arabian coffee",type:"asterids"},"Gardenia taitensis":{name:"Tahitian Gardenia",type:"asterids"},"Coprosma repens":{name:"New Zealand mirrorbush",type:"asterids"},"Morinda citrifolia":{name:"Indian mulberry",type:"asterids"},"Galium verum":{name:"Lady's bedstraw",type:"asterids"},"Asystasia gangetica":{name:"Chinese violet",type:"asterids"},"Thunbergia alata":{name:"Blackeyed Susan Vine",type:"asterids"},"Thunbergia erecta":{name:"Bush Clockvine",type:"asterids"},"Tecoma stans":{name:"Yellow bells",type:"asterids"},"Callicarpa americana":{name:"American beautyberry",type:"asterids"},"Lamium amplexicaule":{name:"Henbit deadnettle",type:"asterids"},"Lamium galeobdolon":{name:"Yellow archangel",type:"asterids"},"Leonurus cardiaca":{name:"Common Motherwort",type:"asterids"},"Marrubium vulgare":{name:"White horehound",type:"asterids"},"Glechoma hederacea":{name:"Ground ivy",type:"asterids"},"Melissa officinalis":{name:"Lemon Balm",type:"asterids"},"Premna serratifolia":{name:"Bastard guelder",type:"asterids"},"Olea europaea":{name:"Olive",type:"asterids"},"Bartsia alpina":{name:"Alpine Bartsia",type:"asterids"},"Russelia equisetiformis":{name:"Firecracker Plant",type:"asterids"},"Plantago major":{name:"Common plantain",type:"asterids"},"Duranta erecta":{name:"Golden dewdrops",type:"asterids"},"Rhaphithamnus spinosus":{name:"Prickly myrtle",type:"asterids"},"Ipomoea pes-caprae":{name:"Beach Morning Glory",type:"asterids"},"Nicotiana glauca":{name:"Tree tobacco",type:"asterids"},"Hyoscyamus niger":{name:"Black henbane",type:"asterids"},"Nicandra physalodes":{name:"Apple of Peru",type:"asterids"},"Solanum marginatum":{name:"Purple African nightshade",type:"asterids"},"Solanum mauritianum":{name:"Mullein Nightshade",type:"asterids"},"Solanum pseudocapsicum":{name:"Jerusalem cherry",type:"asterids"},"Silene vulgaris":{name:"Bladder campion",type:"Caryophyllales"},"Silene acaulis":{name:"Moss campion",type:"Caryophyllales"},"Enchylaena tomentosa":{name:"Ruby Saltbush",type:"Caryophyllales"},"Rivina humilis":{name:"Rougeplant",type:"Caryophyllales"},"Plumbago auriculata":{name:"Cape leadwort",type:"Caryophyllales"},"Coccoloba uvifera":{name:"Seagrape",type:"Caryophyllales"},"Oxyria digyna":{name:"Mountain sorrel",type:"Caryophyllales"},"Dillenia suffruticosa":{name:"Shrubby dillenia",type:"neutral",isPentapetalae:true},"Parnassia palustris":{name:"Grass of Parnassus",type:"rosids"},"Cucumis dipsaceus":{name:"Hedgehog gourd",type:"rosids"},"Cassia fistula":{name:"Golden shower",type:"rosids"},"Acacia longifolia":{name:"Sydney golden wattle",type:"rosids"},"Leucaena leucocephala":{name:"Jumbie bean",type:"rosids"},"Mimosa pudica":{name:"Touch-me-not",type:"rosids"},"Ceratonia siliqua":{name:"Carob tree",type:"rosids"},"Colophospermum mopane":{name:"Mopane",type:"rosids"},"Trifolium repens":{name:"White clover",type:"rosids"},"Cajanus cajan":{name:"Pigeon pea",type:"rosids"},"Clitoria ternatea":{name:"Butterfly pea",type:"rosids"},"Polygala myrtifolia":{name:"Myrtle leaf milkwort",type:"rosids"},"Alnus alnobetula":{name:"Green alder",type:"rosids"},"Fagus sylvatica":{name:"Beech",type:"rosids"},"Chrysobalanus icaco":{name:"Coco plum",type:"rosids"},"Acalypha wilkesiana":{name:"Copper leaf",type:"rosids"},"Ricinus communis":{name:"Castor oil plant",type:"rosids"},"Codiaeum variegatum":{name:"Variegated Croton",type:"rosids"},"Manihot esculenta":{name:"Cassava",type:"rosids"},"Euphorbia balsamifera":{name:"Balsam spurge",type:"rosids"},"Tristellateia australasiae":{name:"Maiden's Jealousy",type:"rosids"},"Passiflora caerulea":{name:"Common Passion Flower",type:"rosids"},"Passiflora edulis":{name:"Purple granadilla",type:"rosids"},"Passiflora foetida":{name:"Fetid passionflower",type:"rosids"},"Turnera subulata":{name:"White Alder",type:"rosids"},"Elaeagnus angustifolia":{name:"Russian olive",type:"rosids"},"Artocarpus altilis":{name:"Breadfruit",type:"rosids"},"Broussonetia papyrifera":{name:"Paper Mulberry",type:"rosids"},"Ficus carica":{name:"Edible Fig",type:"rosids"},"Rhamnus cathartica":{name:"Common buckthorn",type:"rosids"},"Prunus laurocerasus":{name:"Cherry laurel",type:"rosids"},"Prunus padus":{name:"Bird cherry",type:"rosids"},"Prunus persica":{name:"Peach",type:"rosids"},"Kerria japonica":{name:"Japanese rose",type:"rosids"},"Eriobotrya japonica":{name:"Loquat",type:"rosids"},"Rhaphiolepis indica":{name:"Indian hawthorn",type:"rosids"},"Dryas octopetala":{name:"Mountain Avens",type:"rosids"},"Dasiphora fruticosa":{name:"Shrubby cinquefoil",type:"rosids"},"Filipendula ulmaria":{name:"Meadowsweet",type:"rosids"},"Rosa rugosa":{name:"Rugosa rose",type:"rosids"},"Rubus arcticus":{name:"Arctic raspberry",type:"rosids"},"Rubus chamaemorus":{name:"Cloudberry",type:"rosids"},"Rubus phoenicolasius":{name:"Wine raspberry",type:"rosids"},"Rubus spectabilis":{name:"Salmonberry",type:"rosids"},"Laportea aestuans":{name:"West Indian woodnettle",type:"rosids"},"Pilea microphylla":{name:"Artillery plant",type:"rosids"},"Berteroa incana":{name:"Hoary alyssum",type:"rosids"},"Lobularia maritima":{name:"Sweet alyssum",type:"rosids"},"Alliaria petiolata":{name:"Garlic Mustard",type:"rosids"},"Carica papaya":{name:"Papaya",type:"rosids"},"Melochia corchorifolia":{name:"Chocolateweed",type:"rosids"},"Thespesia populnea":{name:"Portia tree",type:"rosids"},"Urena lobata":{name:"Caesarweed",type:"rosids"},"Conocarpus erectus":{name:"Button mangrove",type:"rosids"},"Terminalia catappa":{name:"Tropical almond",type:"rosids"},"Chamelaucium uncinatum":{name:"Geraldton wax",type:"rosids"},"Agonis flexuosa":{name:"Western Australian peppermint",type:"rosids"},"Psidium guajava":{name:"Guava",type:"rosids"},"Xanthostemon chrysanthus":{name:"Golden Penda",type:"rosids"},"Anacardium occidentale":{name:"Cashew",type:"rosids"},"Cotinus coggygria":{name:"Smoketree",type:"rosids"},"Malosma laurina":{name:"Laurel sumac",type:"rosids"},"Mangifera indica":{name:"Mango",type:"rosids"},"Pistacia lentiscus":{name:"Mastic tree",type:"rosids"},"Azadirachta indica":{name:"Neem",type:"rosids"},"Dodonaea viscosa":{name:"Florida hopbush",type:"rosids"},"Acer negundo":{name:"Boxelder",type:"rosids"},"Parthenocissus quinquefolia":{name:"Virginia creeper",type:"rosids"},"Vitis rotundifolia":{name:"Muscadine grape",type:"rosids"},"Ribes aureum":{name:"Golden currant",type:"neutral",isPentapetalae:true},"Saxifraga oppositifolia":{name:"Purple mountain saxifrage",type:"neutral",isPentapetalae:true},"Caladium bicolor":{name:"Heart of Jesus",type:"Liliopsida"},"Zantedeschia aethiopica":{name:"Calla lily",type:"Liliopsida"},"Crinum asiaticum":{name:"Poisonbulb",type:"Liliopsida"},"Zephyranthes candida":{name:"Autumn zephyrlily",type:"Liliopsida"},"Iris japonica":{name:"Butterfly flower",type:"Liliopsida"},"Calypso bulbosa":{name:"Fairy slipper",type:"Liliopsida"},"Dendrobium macrophyllum":{name:"Large-Leaved Dendrobium",type:"Liliopsida"},"Eriophorum scheuchzeri":{name:"White Cottongrass",type:"Liliopsida"},"Cynodon dactylon":{name:"Bermuda grass",type:"Liliopsida"},"Axonopus compressus":{name:"Carpet grass",type:"Liliopsida"},"Alpinia purpurata":{name:"Red Ginger",type:"Liliopsida"},"Hedychium gardnerianum":{name:"Kahili ginger",type:"Liliopsida"},"Clintonia borealis":{name:"Corn lily",type:"Liliopsida"},"Fritillaria camschatcensis":{name:"Kamchatka fritillary",type:"Liliopsida"},"Pandanus belepensis":{name:"Pandanus belepensis",type:"Liliopsida"},"Houttuynia cordata":{name:"Chameleon plant",type:"neutral",isPentapetalae:false},"Banksia praemorsa":{name:"Cut leaf banksia",type:"Proteaceae"},"Embothrium coccineum":{name:"Chilean firebush",type:"Proteaceae"},"Gevuina avellana":{name:"Chilean Hazel",type:"Proteaceae"},"Grevillea robusta":{name:"Silk oak",type:"Proteaceae"},"Leucospermum cordifolium":{name:"Pincushion",type:"Proteaceae"},"Berberis darwinii":{name:"Darwin's barberry",type:"Ranunculales"},"Chelidonium majus":{name:"Greater celandine",type:"Ranunculales"},"Caltha palustris":{name:"Marsh marigold",type:"Ranunculales"},"Actaea rubra":{name:"Red baneberry",type:"Ranunculales"},"Parentucellia viscosa":{name:"Yellow bartsia",type:"asterids"},"Hibiscus × rosa-sinensis":{name:"Chinese Hibiscus",type:"rosids"}},
				
				hiddenPlants: {},
				
				plantTypes: { //todo: remove the colors?
					"rosids": {color: "#ff0000", isPentapetalae: true},
					"asterids": {color: "#00ff00", isPentapetalae: true},
					"Caryophyllales": {color: "#0000ff", isPentapetalae: true},
					
					"Liliopsida": {color: "#ffff00", isPentapetalae: false},
					"Proteaceae": {color: "#ff00ff", isPentapetalae: false},
					"Ranunculales": {color: "#00ffff", isPentapetalae: false},
					
					"neutral": {color: "#ffffff"},
				},
				plantTypeAdvantages: {
					typesIndex: ["rosids", "asterids", "Caryophyllales", "Liliopsida", "Proteaceae", "Ranunculales", "neutral"],
					values: [
						[1, 2, 0.5, 0.5, 0.25, 0.5, 2],
						[0.5, 1, 1, 1, 0.25, 1, 1],
						[2, 2, 1, 1, 0.25, 1, 0.5],
						[2, 2, 1, 1, 0.25, 0.5, 0.5],
						[1, 1, 1, 1, 1, 1, 0.5],
						[2, 2, 1, 2, 0.25, 1, 0.5],
						[0.5, 0.5, 2, 2, 2, 2, 1],
					],
					
					/*
					att/def			"rosids"	"asterids"	"Caryophyllales"	"Liliopsida"	"Proteaceae"	"Ranunculales"	"neutral"
					"rosids"			.			2				0.5				 0.5			 0.25			  0.5			2			= 5.75
					"asterids"			0.5			.				-				 -				 0.25			  -				-			= 4.75
					"Caryophyllales"	2			2				.				 -				 0.25			  -				0.5			= 6.75
					"Liliopsida"		2			2				-				 .				 0.25			  0.5			0.5			= 6.25
					"Proteaceae"		-			-				-				 -				 .				  -				0.5			= 5.5
					"Ranunculales"		2			2				-				 2				 0.25			  .   			0.5			= 7.75
					"neutral"			0.5			0.5				2				 2				 2				  2				. 			= 9
					
								=		8			9.5				6.5				 7.5			 3.25			  6				5*/
				},
				
				plantInfoSpritesMode: false,
				plantInfoSelectedPlant: "",
				plantInfoSelectedAttack: "",
				plantAttackTypes: {
					"rosids": {type: "rosids", isAttack: true},
					"asterids": {type: "asterids", isAttack: true},
					"Caryophyllales": {type: "Caryophyllales", isAttack: true},
					"Liliopsida": {type: "Liliopsida", isAttack: true},
					"Proteaceae": {type: "Proteaceae", isAttack: true},
					"Ranunculales": {type: "Ranunculales", isAttack: true},
					"neutral": {type: "neutral", isAttack: true},
					
					"Anti-Pentapetalae": {value: "args.isOpponentPentapetalae + 1", isPentapetalae: false,
					text: "x2 boost against Pentapetalae plants\nRequirements to use: can only be used by non-pentapetalae plants"},
					
					"Short-Named": {value: "args.opponentName.length / 9", maxLetters: 5,
					text: "More boost the longer the opponent's name is\nRequirements to use: only 5 or fewer letters in plant's name"},
					"Long-Named": {value: "15 / args.opponentName.length", minWords: 3,
					text: "More boost the shorter the opponent's name is\nRequirements to use: at least 3 words in plant's name"},
					
					"High Level": {value: "(args.opponentLevel / 25) + 1", words: ["giant", "large"],
					text: "More boost the higher the opponent's level is\nRequirements to use: \"giant\" or \"large\" in plant's name"},
					"Low Level": {value: "29 / (args.opponentLevel + 4)", words: ["bush", "shrub", "weed", "grass", "flower", "rose"],
					text: "More boost the lower the opponent's level is\nRequirements to use: plant's name refers to small size"},
					
					"Dashing": {value: "getCharacterOccurrenceInString(args.opponentName, ' ') + 1", words: ["-"],
					text: "More boost the more spaces there are in the opponent's name\nRequirements to use: \"-\" in plant's name"},
					
					"Locational": {value: "2 - args.plantDistance*(1/3)", words: ["alpine", "america", "peru", "arabia", "arctic", "australia", "biscayne", "bermuda", "canary", "cape", "chile", "chinese", "florida", "parnassus", "india", "japan", "jerusalem", "kamchatka", "mexican", "zealand", "africa", "russian", "siam", "sodom", "sydney", "tahitian", "virginia"],
					text: "More boost the closer the attack is coming from\nRequirements to use: geographical location in plant's name"},
					
					"Animalistic": {value: "args.isOpponentAnimalistic + 1", words: ["bird", "crow", "hen", "butterfly", "chameleon", "buck", "cow", "fish", "hedgehog", "lark", "flea", "pigeon", "salmon", "dog", "hound", "ant"],
					text: "x2 boost against plants that also have the Animalistic attack\nRequirements to use: name of an animal in plant's name"},
					
					"Negative": {value: "args.typeAdvantageAmount", words: ["bastard", "creep", "devil", "dead", "jealousy", "poison", "prick", "bane", "fever", "not"],
					text: "Multiplies boost by the type advantage amount\nRequirements to use: negative word in plant's name"},
					
					"Berry Good": {value: "1 + (args.boostAmount / 3)", words: ["berry"],
					text: "Multiplies boost by 100% + third of the current boost amount\nRequirements to use: \"berry\" in plant's name"},
					"Possessive": {value: "args.opponentBoostAmount + 0.5", words: ["'s"],
					text: "Multiplies boost by 50% + the opponent's boost amount\nRequirements to use: \"'s\" in plant's name"},
					"Tree-Named": {value: "lowerOpponentBoosts", words: ["tree"],
					text: "Lowers opponent's boost by 33%\nRequirements to use: \"tree\" in plant's name"},
					"Planty": {value: "1 + (args.plantsAmount / 25)", words: ["plant"],
					text: "Multiplies boost by 100% + (4% * amount of plants you have)\nRequirements to use: \"plant\" in plant's name"},
					
					"Colorful": {value: "Math.random() * 3", words: ["black", "blue", "gold", "violet", "green", "purple", "red", "white", "yellow"],
					text: "Multiplies boost by a random amount (at least 100%)\nRequirements to use: name of a basic color in plant's name"},
					
					"Variable": {value: "randomBoost", words: ["bi", "pan"],
					text: "Uses an other random boost instead\nRequirements to use: \"bi\" or \"pan\" in plant's name"},
					
					"Basic": {value: "1.5",
					text: "Multiplies boost by 150%\nRequirements to use: plant doesn't have any other boosts"},
				},
				
				
				layoutSymbols: {
					"-": {mainLayer: {type: "empty"}, data: {drawTile: {color: "#64646400", borderSize: 0}}},
					"o": {mainLayer: {type: "land"}, data: {drawTile: {color: "#5ca257"}}},
				},
				
				mainLayout: {
					symbols: "layoutSymbols",
					arr: [],
				},
				
				mainGrid: {
					grid: {},
					data: {
						x: 0, y: 0, w: 2, h: 2, gaps: {left: 0, right: 0, up: 0, down: 0}, isCentered: true,
						gridShape: "rect",
						gridSize: {w: 0, h: 0}, layers: ["mainLayer"], gameState: "game",
						isFastClick: false,
						hasHitboxes: true,
						
						onload: [
							{f: "setValuesOnGridFromLayout", args: {layoutName: "mainLayout"}},
							{f: "refreshGridSize"},
						],
						
						draw: [
							{f: "fillGridShape", args: {id: "drawTile", color: "#444444", borderColor: "#000000", borderSize: 0.001}},
							{f: "fillGridSprite", args: {id: "drawSprite", spriteSize: {w: 0.9, h: 0.85}}},
						],
						
						tilesData: {symbols: "layoutSymbols", valueName: "type"},
						
						gridDrawData: [],
						gridDrawValues: {},
					}
				},
				
				currentDialogue: {text: ""},
			},
			modifiedVariables: {
				camera: {zoom: {level: 0.1}, y: 0, areDimentionsEqual: true, minWidthToHeightRatio: 2, ...gamePresets["zoomCamera"]},
				
				gameState: {currentState: "game", states: ["game", "plantsInfo", "citation"]},
				
				colors: {
					grayedOut: "#aaaaaa",
				},
			},
			data: {
				description: "Collect and fight plants around the globe!\n(currently still in development)",
				releaseDate: "Late 2026",
				tags: ["creature collector", "plants", "geography"],
				/*videos: [
					{name: "Showcase/Walkthrough Video"},
					{name: '\\"How It Was Made\\" Video'},
				]*/
			},
		},
		
		
		"Game Selection": {
			overriddenVariables: {
				drawOrder: ["drawEntities", "drawGrids", "drawButtons", "drawScrollbars"],
				
				events: {
					onload: ["generateGrids", "resizeNewGamesGrid"],
					onNextFrame: [
						"refreshTimes",
						"moveEntities",
						"drawDayBackground",
						"draw"
					],
					
					resizeNewGamesGrid: [`<<{
						let sizes = [[1,1], [2,1], [2,2], [3,2], [3,3], [3,4], [3,5], [4,5], [4,6], [4,7], [5,7], [5,8], [6,8], [6,9], [7,9], [7,10], [8,10]]; /*this only works up to 80 but idk how to calculate it*/
						let size = {w: 1, h: 1};
						
						for (let i = 0; i < sizes.length; i++){
							if ((Object.keys(gameData).length - 1) <= (sizes[i][0] * sizes[i][1])){
								size = {w: sizes[i][0], h: sizes[i][1]};
								break;
							}
						}
						
						newGamesGrid.data.gridSize = size;
						
						newGamesGrid.data.w = Math.min((1.55 - (size.w - 1) * 0.05) / size.w, 0.4);
						newGamesGrid.data.h = Math.min((1.45 - (size.h - 1) * 0.05) / size.h, 0.25);
						
						generateGrids();
						
						setValuesOnGridFromArray({gridName: "newGamesGrid", value: {name: "gameName"}, arr: currentGame.states});
						refreshGridDrawValues({gridName: "newGamesGrid"});
					}>>`],
					
					refreshTimes: [
						"<<budapestTime.value = new Date(new Date().toLocaleString('en-US', {timeZone: 'Europe/Budapest'}));>>", //Europe/Budapest America/New_York America/Los_Angeles Asia/Tokyo
						"<<budapestTime.hour12 = budapestTime.value.toLocaleString('en-US', { hour: 'numeric', hour12: true})>>",
						"<<budapestTime.hour24 = budapestTime.value.getHours() + budapestTime.value.getMinutes() / 60>>",
						//"<<budapestTime.hour24 = ((budapestTime.value.getHours() + budapestTime.value.getMinutes() / 60 + budapestTime.value.getSeconds()/60/60) * 10000) % 24>>"
					],
					drawDayBackground: [
						"<<colors.backgroundColor = hourColors[Math.floor(budapestTime.hour24)]>>"
					],
					
					selectedGameVideoButtons: [
						"<<currentVideos = (gameData[selectedGame]?.data?.videos ?? []);>>",
						{
							f: "generateButtons", args: {arrName: "currentVideos", gameState: "newGames",
							button: {text: "{{name}}", textSize: 0.325, downscaleTextLength: 5, textColor: "#000000",
							id: "videoButtons", isAbsolutePositioned: true,
							onclick: {f: "runEval", extraArgs: {text: "('{{value}}' != 'undefined') ? window.open('{{value}}') : alert('Video coming soon!')"}}},
							pos: {x: 0.725, y: 0.525, w: 0.19, h: 0.055, margin: {w: 0.01, h: 0.03}}, grid: {w: 1}}
						}
					],
					
					gameSelect: [
						"<<changeButtonArgsById('gameSelectHider', {isHidden: true});>>",
						"<<removeButtonsById('videoButtons');>>",
						"<<runEvent('selectedGameVideoButtons');>>",
						"<<runEvent('refreshCurrentHighScoreText');>>",
					],
					
					refreshCurrentHighScoreText: [`<<{
						let hasHighScore = ((gameSaves[selectedGame] ?? {score: null}).score != null);
						
						currentHighScoreText = "High Score:\\n";
						
						if (hasHighScore){
							let currentScore = gameSaves[selectedGame].score;
							
							if (isObject(currentScore)){
								currentHighScoreText = "High Scores:\\n";
								
								let isFirst = true;
								for (let i in currentScore){
									if (currentScore[i] != null){
										currentHighScoreText += ((!isFirst) ? "\\n" : "");
										currentHighScoreText += i + ": " + currentScore[i] + " " + (gameSaves[selectedGame] ?? {text: ''}).text;
										isFirst = false;
									}
								}
								
								if (currentHighScoreText == "High Scores:\\n"){
									currentHighScoreText += "None";
								}
							} else{
								currentHighScoreText += gameSaves[selectedGame].score + " " + (gameSaves[selectedGame] ?? {text: ''}).text;
							}
						} else{
							currentHighScoreText += "None";
						}
					}>>`],
				},
				gridNames: ["newGamesGrid", "oldGamesGrid"],
				
				buttons: {
					main: [
						{pos: {x: 0.3, y: 0.5, w: 0.2, h: 0.2}, text: "Newer Games", textSize: 0.14, subtext: "({{Object.keys(gameData).length-1}} Games)", subtextPos: {x: 0.325, y: 0.325},
						onclick: "<<gameState.currentState = 'newGames';>>", isAbsolutePositioned: true},
						
						{pos: {x: 1-0.3, y: 0.5, w: 0.2, h: 0.2}, text: "Older Games", textSize: 0.14, subtext: "({{oldGames.length}} Games)", subtextPos: {x: 0.325, y: 0.325},
						onclick: "<<gameState.currentState = 'oldGames';>>", isAbsolutePositioned: true},
						
						{pos: {x: 0.5, y: 0.925, w: 0.2, h: 0.2}, text: "It's {{budapestTime.hour12}} in parts of Europe", textSize: 0.14, textColor: "#ffffff",
						isAbsolutePositioned: true, ...gamePresets.textButton},
						
						{pos: {x: 0.5, y: 0.85, w: 0.2, h: 0.2}, textSize: 0.07, textColor: "#ffffff",
						text: "{{(budapestTime.hour24 % 12 == 0) ? ((budapestTime.hour24 == 12) ? 'It\\'s high noon.' : 'It\\'s high nigh.') : ''}}",
						isAbsolutePositioned: true, ...gamePresets.textButton},
						
						{pos: {x: 0.5, y: 0.0375, w: 0.1, h: 0.1}, text: "{{(browserName != 'Chrome') ? '(to ensure that everything works as intended, please consider opening this site with Google Chrome)' : ''}}", textSize: 0.14, textColor: "#ffffff",
						isAbsolutePositioned: true, ...gamePresets.textButton},
					],
					newGames: [
						{pos: {x: 0.725, y: 0.425, w: 0.4, h: 0.8}, text: "", color: "#FFFFFF88", isAbsolutePositioned: true, disableClick: true},
						
						{pos: {x: 0.725, y: 0.13, w: 0.25, h: 0.15}, text: "{{(selectedGame ?? '').replaceAll(' ', '\\n')}}",
						textSize: 0.1, marginY: 0.095, textColor: colors.black, color: "#FFFFFF66", isAbsolutePositioned: true, disableClick: true},
						
						{pos: {x: 0.725, y: 0.28, w: 0.38, h: 0.1}, text: "{{(gameData[selectedGame]?.data?.description ?? '')}}",
						textSize: 0.215, marginY: 0.1, downscaleTextLength: 8, textColor: colors.black, color: "#FFFFFF44", isAbsolutePositioned: true, disableClick: true},
						
						{pos: {x: 0.765 + 0.15/2, y: 0.4, w: 0.15, h: 0.1}, text: "{{(gameData[selectedGame]?.data?.tags ?? []).join(',\\n')}}",
						textSize: 0.08, marginY: 0.1, downscaleTextLength: 21, textColor: colors.black, color: "#00000000", isAbsolutePositioned: true, disableClick: true},
						{pos: {x: 0.77 - 0.01, y: 0.4, w: 0.05, h: 0.1}, text: "tags:",
						textSize: 0.3, textColor: colors.black, color: "#00000000", isAbsolutePositioned: true, disableClick: true},
						
						{pos: {x: 0.725-(0.77-0.725)*2, y: 0.4, w: 0.2, h: 0.1}, text: "Release Date: {{gameData[selectedGame]?.data?.releaseDate ?? '???'}}",
						textSize: 0.185, downscaleTextLength: 8, textColor: colors.black, color: "#00000000", isAbsolutePositioned: true, disableClick: true},
						
						{pos: {x: 0.58, y: 0.57, w: 0.1, h: 0.1}, text: "{{currentHighScoreText}}",
						textSize: 0.19, marginY: 0.1, downscaleTextLength: 8, textColor: colors.black, color: "#00000000", isAbsolutePositioned: true, disableClick: true},
						
						
						{pos: {x: 0.725, y: 0.725, w: 0.25, h: 0.1}, text: "Start", textSize: 0.15, onclick: "<<loadGame({gameName: selectedGame});>>", isAbsolutePositioned: true},
						
						{pos: {x: 0.725, y: 0.425, w: 0.4, h: 0.8}, text: "<-- Select a game!", id: "gameSelectHider",
						textColor: colors.black, color: "#f0f0f0", textSize: 0.075, isAbsolutePositioned: true, disableClick: true},
						
						
						{pos: {x: 0.9125, y: 0.915, w: 0.1, h: 0.08}, text: "Back", textSize: 0.225, onclick: "<<gameState.currentState = 'main';>>", isAbsolutePositioned: true},
					],
					oldGames: [
						{pos: {x: 0.0325, y: 0.0275, w: 0.05, h: 0.025}, text: "old site", textSize: 0.175, onclick: "<<window.open('https://soverthe.github.io/oldWebsite.html');>>", isAbsolutePositioned: true},
						
						{pos: {x: 0.9125, y: 0.915, w: 0.1, h: 0.08}, text: "Back", textSize: 0.225, onclick: "<<gameState.currentState = 'main';>>", isAbsolutePositioned: true},
					]
				},
				
				entities: [
					{pos: {x: 0, y: 0.5, w: 0.06, shape: "circle"}, color: "#FFFF00", movement: {
						type: "rotateEntityAroundTarget", target: {x: 0.5, y: 1}, radius: {x: 0.45, y: 0.95},
						radians: "<<(budapestTime.hour24 - 6.5 + Math.PI * 4) * Math.PI * 2 / 24>>"}, isAbsolutePositioned: true
					},
					{pos: {x: 0, y: 0.5, w: 0.06, shape: "circle"}, color: "#444444", movement: {
						type: "rotateEntityAroundTarget", target: {x: 0.5, y: 1}, radius: {x: 0.45, y: 0.95},
						radians: "<<(budapestTime.hour24 - 6.5) * Math.PI * 2 / 24>>"}, isAbsolutePositioned: true
					}
				],
			},
			createdVariables: {
				currentHighScoreText: "",
				
				budapestTime: {},
				hourColors: [
					"#000000","#000000","#000000","#000000","#000000","#000000","#440022","#221679","#3355bb","#4488ff","#4488ff","#4488ff","#4488ff",
					"#4488ff","#4488ff","#4488ff","#3355bb","#221679","#440022","#000000","#000000","#000000","#000000","#000000","#000000"
				],
				
				//gamesArray: currentGame.states,
				oldGames: [
					{name: "Cursetris", href: "Cursetris", date: "Late 2024"},
					{name: "Nonograms", href: "Nonograms", date: "Early 2024"},
					{name: "Stardew Guess Who", href: "StardewGuessWho", date: "May 2022"},
					{name: "Adventures of FF Island\n(a game for ComputerCraft)", href: "FFIslandInstallation", date: "April 2021"}
				],
				
				newGamesGrid: {
					grid: {},
					data: {
						//the w, h and gridSize are changed in resizeNewGamesGrid
						x: -0.85, y: 0, w: 0.35, h: 0.2, gaps: {left: 0.025, right: 0.025, up: 0.025, down: 0.025}, isCentered: true,
						gridShape: "rect",
						gridSize: {w: 4, h: 6}, layers: ["base"], gameState: "newGames",
						isFastClick: false,
						
						draw: [
							{f: "fillGridShape", args: {id: "drawTile", borderColor: "#000000", borderSize: 0.003,
							borderColor: "menuBorder"}},
							{f: "fillGridText", args: {id: "drawNames", textSize: 0.8, outlineSize: 0.002,
							textColor: "#FFFFFF", outlineColor: "menuBorder", marginY: 0.15, breakSpaces: true, downscaleTextLength: 2}},
						],
						
						gridDrawData: [
							{
								value: {name: "gameName", value: undefined},
								isTrue: {drawTile: {color: "#333333"}},
								isFalse: {drawTile: {color: "#FFFFFFE8"}, drawNames: {value: "gameName"}}
							}
						],
						gridDrawValues: {},
						
						onclick: {
							value: {name: "mouseButton", value: 1},
							isTrue: {
								value: {name: "gameName", value: undefined},
								isFalse: [
									"<<selectedGame = args.gameName;>>",
									"<<runEvent('gameSelect');>>",
								]
							}
						},
						
						hover: {
							tiles: {}, time: 0.2, clickMultiplier: 1.5, maxHoverAlphaNum: 0.3, fadeInMultiplier: 1, fadeOutMultiplier: 1,
							color: "hsla(0, 100%, 100%, {{alphaNum}})"
						}
					}
				},
				oldGamesGrid: {
					grid: {},
					data: {
						x: 0, y: 0, w: 0.9, h: 0.4, gaps: {left: 0.1, right: 0.1, up: 0.1, down: 0.1}, isCentered: true,
						gridShape: "rect",
						gridSize: {w: 2, h: 2}, layers: ["base"], gameState: "oldGames",
						isFastClick: false,
						
						onload: [
							{f: "setValuesOnGridFromArray", args: {arrName: "oldGames"}},
						],
						
						draw: [
							{f: "fillGridShape", args: {id: "drawTile", borderColor: "#000000", borderSize: 0.003}},
							{f: "fillGridText", args: {id: "drawNames", textColor: "#000000", textSize: 1.25, outlineSize: 0.0001, outlineColor: "#000000", marginY: 0.175, downscaleTextLength: 1}},
							{f: "fillGridText", args: {id: "drawDates", textColor: "#000000", textSize: 0.05, outlineSize: 0.0001, outlineColor: "#000000", textOffset: {x: 0.1535, y: 0.094}}},
						],
						
						gridDrawData: [
							{
								value: {name: "name", value: undefined},
								isFalse: {drawTile: {color: "#ffffff"}, drawNames: {value: "name"}, drawDates: {value: "date"}}
							}
						],
						gridDrawValues: {},
						
						onclick: {
							value: {name: "mouseButton", value: 1},
							isTrue: {
								value: {name: "href", value: undefined},
								isFalse: {f: "runEval", extraArgs: {text: "window.open('https://soverthe.github.io/' + args.href + '.html')"}}
							}
						},
						
						hover: {
							tiles: {}, time: 0.2, clickMultiplier: 1.5, maxHoverAlphaNum: 0.3, fadeInMultiplier: 1, fadeOutMultiplier: 1,
							color: "hsla(0, 100%, 100%, {{alphaNum}})"
						}
					}
				}
			},
			modifiedVariables: {
				camera: {zoom: {level: 0.3}, areDimentionsEqual: true, minWidthToHeightRatio: 2, ...gamePresets["lockedCamera"]},
				
				gameState: {currentState: "main", states: ["main", "oldGames", "newGames"]},
				
				colors: {
					menuBorder: {
						pos: {start: {x: 0, y: 0.15}, end: {x: 0, y: 0.85}}, isScaled: false,
						colorStops: [["0", colors.bi[0]], ["0.5", colors.bi[1]], ["1", colors.bi[2]]]
					}
				}
			}
		},
	}
	
//</script>