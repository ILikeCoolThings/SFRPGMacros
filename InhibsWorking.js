/* Notes:

***Install module "Turn Alert" for turn tracking***

This macro is to be used on NPCs in combat. Only use it on one token at a time. It will:
	Add condition icons.
	Change the below values based on the condition:
		Attack bonus
		Attack damage
		KAC and EAC
		Fort, Will, and Ref Saves
		Movement speed
	Add an alert based on round duration for letting the GM and players know when the condition expires.
		*Doesn't link to a character. So you still have to be mindful for multiple enemies with the same condition.*
	Has an undo feature to remove the condition for when the condition expires.

Possible future additions:
	Add a checker to not add more than one instance of a condition.
	Add a way to modify abiity scores (Not sure how often this comes up in combat. Not much in my expeirence.)
	Check if Turn Alert is installed to not spam the turn error.
	FX Effects?
*/

(async ()=> {
	if (canvas.tokens.controlled.length === 0)
	  	return ui.notifications.error("Please select a token first");
	
	//Dialog Variables
	let applyChanges = false;
	
	//text box
	new Dialog({
		title: `NPC Conditions`,
		content: `
			<form>
				<div class="form-group1">
					<label>Type: (Conds with a * only apply icon and alert.)</label>
					<select id="modifier" name="modifier">
						<option value="Asleep">Condition: Asleep*</option>		
						<option value="Blinded">Condition: Blinded</option>	
						<option value="Confused">Condition: Confused*</option>
						<option value="Cowering">Condition: Cowering</option>
						<option value="Dazed">Condition: Dazed*</option>
						<option value="Dazzled">Condition: Dazzled</option>
						<option value="Deafened">Condition: Deafened*</option>
						<option value="Encumbered">Condition: Encumbered</option>
						<option value="Entangled">Condition: Entangled</option>
						<option value="Exhausted">Condition: Exhausted</option>
						<option value="Fatigued">Condition: Fatigued</option>
						<option value="Flatfooted">Condition: Flatfooted</option>
						<option value="Frightened">Condition: Frightened</option>
						<option value="Grappled">Condition: Grappled</option>
						<option value="Nauseated">Condition: Nauseated*</option>
						<option value="Offkilter">Condition: Offkilter</option>
						<option value="Offtarget">Condition: Offtarget</option>
						<option value="Panicked">Condition: Panicked</option>
						<option value="Paralyzed">Condition: Paralyzed*</option>
						<option value="Pinned">Condition: Pinned</option>
						<option value="Prone">Condition: Prone</option>
						<option value="Sickened">Condition: Sickened</option>
						<option value="Shaken">Condition: Shaken</option>
						<option value="Staggered">Condition: Staggered*</option>
						<option value="Stunned">Condition: Stunned</option>			
						<option value="HitMod">Inhib: -1 to Hit</option>
						<option value="ACMod">Inhib: -2 to AC</option>
						<option value="MovespeedMod">Inhib: Half Movespeed</option>
					</select>
					<label>Undo?</label>
						<input id ="undoFlag" name="undoFlag" type="checkbox" value="off"/>
				</div>
				<div class="form-group2">
					<label for="formRounds" style="float:left;"> Effect rounds: </label>
					<span style="display: block; overflow: hidden; padding: 0 4px 0 6px;">
						<input id="formRounds" name="formRounds" type="number" value="1"/>
					</span>
				</div>
			</form>
			`,
		buttons: {
			yes: {
				icon: "<i class='fas fa-check'></i>",
				label: `Apply Changes`,
				callback: async () => applyChanges = true
			},
			no: {
				icon: "<i class='fas fa-times'></i>",
				label: `Cancel Changes`
			},
		},
		default: "yes",
		close: async (html) => {
			if (applyChanges) {
				
				//Form Stuff
				const formRounds = parseInt(document.getElementById('formRounds').value);
				const undoFlag = document.getElementById('undoFlag').checked;
				let modifier = html.find('[name="modifier"]')[0].value || "none";
				
				//begin changes
				for ( let token of canvas.tokens.controlled ) {
				

					//Token paths
					let playerActor = canvas.tokens.controlled[0].actor;
					let tokenType = playerActor.type;
					let tokenName = playerActor.name;

					//Alert variables
					
					//Constants
					const MOVEMENT_MOD = 2

					const DAZZZLED_MOD = -1;
					const ENCUMBERED_MOD = -2;
					const ENCUMBERED_SPEED_MOD = -10;
					const ENTANGLED_MOD = -2;
					const EXHAUSTED_MOD = -3;
					const FATIGUED_MOD = -1;
					const FRIGHTENED_MOD = -2;
					const GRAPPLED_MOD = -2;
					const OFFKILTER_MOD = -2;
					const OFFTARGET_MOD = -2;
					const PANICKED_MOD = -2;
					const PINNED_MOD = -4;
					const PRONE_MOD = -4;
					const SICKENED_MOD = -2;
					const SHAKEN_MOD = -2;

					const INHIB_AC_MOD = -2;
					const INHIB_BAB_MOD = -1;				
					
					//Reused Variables
					let condName = ''
					let lowerCondName = ''

						/*case "Condition":
							condName = "Condition"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (token.actor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							token.actor.setCondition(lowerCondName, true);
							token.actor.update({"data.conditions.condition" : true});
							if (tokenType == "npc") {
								//ADJUST VALUES
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								token.actor.setCondition(lowerCondName, false);
                				token.actor.update({"data.conditions.condition" : false});
							}
							break;
							*/


					//Condition Calls
					switch (modifier)
					{
						//Test
						case "Test":
							modifyAbility(playerActor,undoFlag,-1,"str")
							break;


						//Asleep
						case "Asleep":
							condName = "Asleep"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
								await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -10 to perception
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;

							
						//Blinded
						case "Blinded":
							condName = "Blinded"
                            lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
                            if (!undoFlag) {
                                if (playerActor.hasCondition(lowerCondName) == true){
                                    return ui.notifications.error("Token already has that condition!")
                                }
                                await playerActor.setCondition(lowerCondName, true);
                                applyFlatfooted(playerActor,undoFlag,tokenType);
                            if (tokenType == "npc") {
                                //TODO: -4 to Str and Dex based skill checks
                                }
                            turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
                            }
                            else {
                                await playerActor.setCondition(lowerCondName, false);
                                applyFlatfooted(playerActor, undoFlag, tokenType);
                                
                            }
							break;

						//Cowering
						case "Cowering":
							condName = "cowering"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							applyFlatfooted(playerActor,undoFlag,tokenType);
							if (tokenType == "npc") {
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
								applyFlatfooted(playerActor,undoFlag,tokenType);
							}
							break;
							
							
						//Confused
						case "Confused":
							condName = "Confused"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;


						//Dazed 
						case "Dazed":
							condName = "Dazed"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
							

						//Dazzled
						case "Dazzled":
							condName = "Dazzled"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -1 perception
								modifyBAB(playerActor,undoFlag,DAZZZLED_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
							

						//Deafened
						case "Deafened":
							condName = "Deafened"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -4 perception checks
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
								

						//Encumbered
						case "Encumbered":
							condName = "Encumbered"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: Max dex??
								modifyMovementConst(playerActor,undoFlag,ENCUMBERED_SPEED_MOD);
								modifyAC(playerActor,undoFlag,ENCUMBERED_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
							

						

						//Entangled
						case "Entangled":
							condName = "Entangled"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								modifyMovement(playerActor,undoFlag,MOVEMENT_MOD);
								modifyBAB(playerActor,undoFlag,ENTANGLED_MOD);
								modifyAC(playerActor,undoFlag,ENTANGLED_MOD);
								modifyRefSave(playerActor,undoFlag,ENTANGLED_MOD);
								//TODO: -2 Dex skill and ability checks
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
							

						//Exhausted
						case "Exhausted":
							condName = "Exhausted"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -3 Str/Dex-based skill and ability checks
								modifyAC(playerActor,undoFlag,EXHAUSTED_MOD);
								modifyBAB(playerActor,undoFlag,EXHAUSTED_MOD);
								modifyAD(playerActor,undoFlag,EXHAUSTED_MOD,true,false);
								modifyRefSave(playerActor,undoFlag,EXHAUSTED_MOD);
								modifyMovement(playerActor,undoFlag,MOVEMENT_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
							

						//Fatigued
						case "Fatigued":
							condName = "Fatigued"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								modifyAC(playerActor,undoFlag,FATIGUED_MOD);
								modifyBAB(playerActor,undoFlag,FATIGUED_MOD);
								modifyRefSave(playerActor,undoFlag,FATIGUED_MOD);
								modifyAD(playerActor,undoFlag,FATIGUED_MOD,true,false);
								//TODO: -1 Str/Dex-based skill and ability checks
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
							

						//Flatfooted
						case "Flatfooted":
							condName = "Flatfooted"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							applyFlatfooted(playerActor,undoFlag,tokenType);
							if (tokenType == "npc") {
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
								applyFlatfooted(playerActor,undoFlag,tokenType);
							}
							break;
							
						
						//Frightened
						case "Frightened":
							condName = "Frightened"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -2 ability checks, and skill checks
								modifyRefSave(playerActor,undoFlag,FRIGHTENED_MOD);
								modifyFortSave(playerActor,undoFlag,FRIGHTENED_MOD);
								modifyWillSave(playerActor,undoFlag,FRIGHTENED_MOD);
								modifyBAB(playerActor,undoFlag,FRIGHTENED_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;

						//Grappled
						case "Grappled":
							condName = "Grappled"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -2 dex skill/ability
								modifyRefSave(playerActor,undoFlag,GRAPPLED_MOD);
								modifyBAB(playerActor,undoFlag,GRAPPLED_MOD);
								modifyAC(playerActor,undoFlag,GRAPPLED_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;							

						//Nauseated
						case "Nauseated":
							condName = "Nauseated"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;


						//Off-Kilter
						case "Offkilter":
							condName = "Offkilter"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							applyFlatfooted(playerActor,undoFlag,tokenType)
							if (tokenType == "npc") {
								//TODO: No moves
								modifyBAB(playerActor,undoFlag,OFFKILTER_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
								applyFlatfooted(playerActor,undoFlag,tokenType)
							}
							break;

						//Off-Target
						case "Offtarget":
							condName = "Offtarget"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								modifyBAB(playerActor,undoFlag,OFFTARGET_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
						
						//Panicked
						case "Panicked":
							condName = "Panicked"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -2 ability checks, and skill checks
								modifyRefSave(playerActor,undoFlag,PANICKED_MOD);
								modifyFortSave(playerActor,undoFlag,PANICKED_MOD);
								modifyWillSave(playerActor,undoFlag,PANICKED_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;

						//Paralyzed
						case "Paralyzed":
							condName = "Paralyzed"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: -5 dex, no moves
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
							
						//Pinned
						case "Pinned":
							condName = "Pinned"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							applyFlatfooted(playerActor,undoFlag,tokenType);
							if (tokenType == "npc") {
								//TODO: no moves and -4 dex skill/ability
								modifyAC(playerActor,undoFlag,PINNED_MOD);
								modifyBAB(playerActor,undoFlag,PINNED_MOD);
								modifyRefSave(playerActor,undoFlag,PINNED_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
								applyFlatfooted(playerActor,undoFlag,tokenType);
							}
							break;
							

						//Prone
						case "Prone":
							condName = "Prone"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								//TODO: +4 range AC, -4 melee AC
								modifyBAB(playerActor,undoFlag,PRONE_MOD,true,false);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;

						//Shaken
						case "Shaken":
							condName = "Shaken"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								modifyRefSave(playerActor,undoFlag,SHAKEN_MOD);
								modifyFortSave(playerActor,undoFlag,SHAKEN_MOD);
								modifyWillSave(playerActor,undoFlag,SHAKEN_MOD);
								modifyBAB(playerActor,undoFlag,SHAKEN_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;
						
						//Sickened
						case "Sickened":
							condName = "Sickened"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								modifyRefSave(playerActor,undoFlag,SICKENED_MOD);
								modifyFortSave(playerActor,undoFlag,SICKENED_MOD);
								modifyWillSave(playerActor,undoFlag,SICKENED_MOD);
								modifyBAB(playerActor,undoFlag,SICKENED_MOD);
								modifyAD(playerActor,undoFlag,SICKENED_MOD);
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;

						//Staggered
						case "Staggered":
							condName = "Staggered"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							if (tokenType == "npc") {
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
							}
							break;

						//Stunned
						case "Stunned":
							condName = "Stunned"
							lowerCondName = condName.charAt(0).toLowerCase() + condName.slice(1)
							if (!undoFlag) {
								if (playerActor.hasCondition(lowerCondName) == true){
									return ui.notifications.error("Token already has that condition!")
								}
							await playerActor.setCondition(lowerCondName, true);
							applyFlatfooted(playerActor,undoFlag,tokenType);
							if (tokenType == "npc") {
								}
							turnAlert(formRounds,condName.concat(" has ended on ",tokenName,"!"))
							}
							else {
								await playerActor.setCondition(lowerCondName, false);
								applyFlatfooted(playerActor,undoFlag,tokenType);
							}
							break;



						//Biohacker Inhibs//

						//Basic Inhibs
						//AC Mod
						case "ACMod":
							modifyAC(playerActor,undoFlag,INHIB_AC_MOD);
							//token.toggleEffect(effectbrokenshield);
							if (undoFlag) {
								turnAlert(formRounds,"AC inhib has ended!")
							}
							break;
						
						
						//Hit Debuff	
						case "HitMod":
							modifyBAB(playerActor,undoFlag,INHIB_BAB_MOD);
							//token.toggleEffect(effectofftarget);
							if (undoFlag) {
								turnAlert(formRounds,"Attack inhib has ended!")
							}
							break;
						

						//Movespeed
						case "MovespeedMod":
							modifyMovement(playerActor,undoFlag,MOVEMENT_MOD);
							//token.toggleEffect(effectentangled);
							if (undoFlag) {
								turnAlert(formRounds,"Movespeed inhib has ended!")
							}
							break;	

					}
				}
			}
		}
	}).render(true);
})();

function modifyBAB (actor,is_Undo,babMod, affectMelee = true, affectRanged = true) {
    let newBAB = 0;
    if (!is_Undo) {
        actor.data.items.forEach(item => {
            //Skip over melee weapons if affectMelee === false
            if (!affectMelee && item.data.data.actionType === 'mwak')
                return;
        
            //Skip over ranged weapons if affectRanged === false
            if (!affectRanged && item.data.data.actionType === 'rwak')
                return;

            newBAB = item.data.data.attackBonus + babMod;
            item.update({"data.attackBonus": newBAB});
            item.data.data.attackBonus = newBAB;
        });

    } else {
        actor.data.items.forEach(item => {
            //Skip over melee weapons if affectMelee === false
            if (!affectMelee && item.data.data.actionType === 'mwak')
                return;
        
            //Skip over ranged weapons if affectRanged === false
            if (!affectRanged && item.data.data.actionType === 'rwak')
                return;

            newBAB = item.data.data.attackBonus - babMod;
            item.update({"data.attackBonus": newBAB});
            item.data.data.attackBonus = newBAB;
        });
    }
};

function modifyAD (actor,is_Undo,adMod, affectMelee = true, affectRanged = true) {
    if (is_Undo == false) {
        actor.data.items.forEach(item => {
            let update = [];

            if (typeof item.data.data.damage === 'undefined')
                return;
            if (typeof item.data.data.damage.parts === 'undefined')
                return;
            if (item.data.data.damage.parts.length === 0)
                return;

            //Skip over melee weapons if affectMelee === false
            if (!affectMelee && item.data.data.actionType === 'mwak')
                return;
            
            //Skip over ranged weapons if affectRanged === false
            if (!affectRanged && item.data.data.actionType === 'rwak')
                return;
				console.log(item)
            update = item.data.data.damage.parts + adMod;
            item.update({"data.damage.parts": update});
        });
    } else {
        actor.data.items.forEach(item => {
            let update = [];
            if (typeof item.data.data.damage === 'undefined')
                return;
            if (typeof item.data.data.damage.parts === 'undefined')
                return;
            if (item.data.data.damage.parts.length === 0)
                return;

            //Skip over melee weapons if affectMelee === false
            if (!affectMelee && item.data.data.actionType === 'mwak')
                return;
        
            //Skip over ranged weapons if affectRanged === false
            if (!affectRanged && item.data.data.actionType === 'rwak')
                return;

            update = item.data.data.damage.parts;
            update[0][0] = update[0][0].substring(0, update[0][0].length - adMod.length);
            item.update({"data.damage.parts": update});
        });
    }
};

/*
console.log("[MODIFY ABILITY DEBUG]");
console.log(actorAbilities);
if (!is_Undo) {
	for (const abil in actorAbilities) {
		//console.log(${abil}: ${actorAbilities[abil]});
		//console.log(abil)
		if (abil === skill) {
			console.log("[MODIFY SKILL] " + abil + " [BY VALUE] " + asMod);
			console.log("[" + abil + " CURRENT VALUE] " + actorAbilities[abil].value);
			//Get current ability score value
			let currentValue = actorAbilities[abil].value;

			//Modify specifically the value of desired skill
			actorAbilities[abil].value = currentValue + asMod;
			console.log("[NEW VALUE] " + actorAbilities[abil].value);

			//Create data path string
			let datapath = "data.abilities." + abil +".value";
			console.log("[DATA PATH] " + datapath);
			//Push entire skill object out to actor as update
			actor.update({datapath: currentValue + asMod});
			console.log(actor);
		}
			//actorAbilities[skill].update();
	}
} else {
	//actor.data.items.forEach(item => {
	//    actor.data.abilities.forEach(ability => {
	//        console.log(ability)

	//    });
	//});
};
*/

function modifyAC (actor,is_Undo,acMod) {
	let actorEac = actor.data.data.attributes.eac.value;
	let actorKac = actor.data.data.attributes.kac.value;
	if (is_Undo == false) {
		actor.update({
			data: {
			attributes: {
				eac: {
					value: actorEac + acMod
				},
				kac:{
					value: actorKac + acMod
				}
			}
			}
		})
	} else {
		actor.update({
			data: {
			attributes: {
				eac: {
					value: actorEac - acMod
				},
				kac:{
					value: actorKac - acMod
				}
			}
			}
		})
	}
};

function modifyRefSave (actor,is_Undo,refMod,rounds=-1,message="") {
	let actorRefSave = actor.data.data.attributes.reflex.bonus;
	console.log(actor)
	if (is_Undo == false) {
		actor.update({
			data: {
				attributes: {
					reflex: {
						bonus: actorRefSave + refMod
					}
				}
			}
		})
	} else {
		actor.update({
			data: {
				attributes: {
					reflex: {
						bonus: actorRefSave - refMod
					}
				}
			}
		})
	}
};

function modifyFortSave (actor,is_Undo,fortMod,rounds=-1,message="") {
	let actorFortSave = actor.data.data.attributes.fort.bonus;
	if (is_Undo == false) {
		actor.update({
			data: {
				attributes: {
					fort: {
						bonus: actorFortSave + fortMod
					}
				}
			}
		})
	} else {
		actor.update({
			data: {
				attributes: {
					fort: {
						bonus: actorFortSave - fortMod
					}
				}
			}
		})
	}
};

function modifyWillSave (actor,is_Undo,willMod,rounds=-1,message="") {
	let actorWillSave = actor.data.data.attributes.will.bonus;
	if (is_Undo == false) {
		actor.update({
			data: {
				attributes: {
					will: {
						bonus: actorWillSave + willMod
					}
				}
			}
		})
	} else {
		actor.update({
			data: {
				attributes: {
					will: {
						bonus: actorWillSave - willMod
					}
				}
			}
		})
	}
};

function modifyMovement (actor,is_Undo,movementMod,rounds=-1,message="") {
	let actorSpeedValue = actor.data.data.attributes.speed.value;
	if (is_Undo == false) {
		actor.update({
			data: {
			attributes: {
				speed: {
					value: actorSpeedValue / movementMod
				}
			}
			}
		});
	} else {
		actor.update({
			data: {
			attributes: {
				speed: {
					value: actorSpeedValue * movementMod
				}
			}
			}
		});
	}
};

function modifyMovementConst (actor,is_Undo,movementMod,rounds=-1,message="") {
	let actorSpeedValue = actor.data.data.attributes.speed.value;
	if (is_Undo == false) {
		actor.update({
			data: {
			attributes: {
				speed: {
					value: actorSpeedValue + movementMod
				}
			}
			}
		});
	} else {
		actor.update({
			data: {
			attributes: {
				speed: {
					value: actorSpeedValue - movementMod
				}
			}
			}
		});
	}
};

/*
token.actor.setCondition("flat-footed", true);
token.actor.update({"data.conditions.flat-footed" : true});
*/

function applyFlatfooted (actor,is_Undo,tokenType) {
	const FLAT_FOOT_MOD = -2;
	if (is_Undo == false) {
		if (token.actor.hasCondition("flat-footed") == true){
			return
		}
		actor.setCondition("flat-footed", true);
		//actor.update({"data.conditions.flat-footed" : true});
		if (tokenType == "npc"){
			modifyAC(actor,is_Undo,FLAT_FOOT_MOD);
		}
	} else {
		//token.actor.update({"data.conditions.flat-footed" : false});
		actor.setCondition("flat-footed", false);
		if (tokenType == "npc"){
			modifyAC(actor,is_Undo,FLAT_FOOT_MOD);
		}
	}
};

function turnAlert (rounds,message) {
	try {
		let alertData = {
			round: rounds,
			roundAbsolute: false,
			turnId: game.combat.combatant.id,
			message: message
		};
		TurnAlert.create(alertData);
	} catch (error) {
		return ui.notifications.error("Error with sending alert to combat tracker!")
	}
}
