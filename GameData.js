//<script> //(you can switch the Notepad++ language to HTML to make events look nicer :>)
	
	var currentGame = {currentState: "Game Selection", states: []};
	var selectedGame = "";
	
	var gameSaves = { //(the trophies are currently unused)
		"Creature Pather": {score: null, text: ""},
		"Not-So-Quick Save": {score: null, text: "Clicks", trophies: {gold: 36, silver: 143, bronze: 250, mode: "less"}},
		"Shape-Shifting Minesweeper": {score: {Tiny: null, Medium: null, Huge: null}, text: "Explosions", trophies: {gold: 0, silver: 2, bronze: 5, mode: "less"}, sizes: ["Tiny", "Medium", "Huge", "Massive"]},
		"Countries Quiz": {score: null, text: "First Tries", trophies: {gold: 198, silver: 100, bronze: 20, mode: "more"}},
		"''Fascinating'' ''Possibilities''": {score: null, text: "Clicks", trophies: {gold: null, silver: null, bronze: null, mode: "less"}},
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
									textSize: 1, id: "layerButton",
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
									textSize: 1, id: "layerButton",
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
									textSize: 1, id: "layerButton",
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
									text: "🖋", title: "Rename", textSize: 1, id: "layerButton",
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
									text: "c", title: "Clone", textSize: 1, id: "layerButton",
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
									text: "x", title: "Delete", textSize: 1, id: "layerButton", isLocked: (objectLength(entities[1].pos.arr) < 2),
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
									
									if (isMouseDown && clickedButton.i == ""){
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
									
									if (isMouseDown && clickedButton.i == ""){
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
						let instantButtons = [{name: "deleteSelected", eventName: "deleteSelectedVertices"}, {name: "moveSelectedToEdge", eventName: "moveSelectedToEdge"}];
						
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
							let name = instantButtons[i];
							
							buttons.art.push({
								pos: {x: 0.035 + i*0.04, y: 0.175 + 2*0.095, w: 0.035, h: 0.07},
								text: "🕴", textSize: 1.1, isAbsolutePositioned: true, title: instantButtons[i].name,
								sprites: [(drawToolSprites[instantButtons[i].name] ?? "emptyBox")],
								onclick: [instantButtons[i].eventName],
							});
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
					deleteSelected: "deleteSelectedSymbol", moveSelectedToEdge: "moveSelectedToEdgeSymbol"
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
					backgroundColor: "#575757", //#646464
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