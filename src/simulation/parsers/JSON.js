'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Simulation from '../simulation.js';
import Frame from '../frame.js';
import Transition from '../transition.js';
import TransitionCSV from '../transitionCSV.js';
import Parser from "./parser.js";
import ChunkReader from '../../components/chunkReader.js';

export default class CSV extends Parser { 
		
	constructor(fileList) {
		super(fileList); 
		this.frames = [];
		this.models =[];
		this.simulationX = new Simulation();
	}
		
	IsValid() {		
		var d = Lang.Defer();
		var json = Array.Find(this.files, function(f) { return f.name.match(/.json/i); });
		
		if (!json ) d.Resolve(false);
		
   		var reader = new ChunkReader();

		reader.ReadChunk(json, 400).then((ev) => {
			var type = ev.result.match(/type\s*:\s*(.+)/);
			
			d.Resolve(type == null);
		});
  		
		return d.promise;
	}
	
	Parse(files, settings) {
		var d = Lang.Defer();
		var simulation = new Simulation();
		
		this.files = files;
		this.settings = settings;		
		var json = Array.Find(files, function(f) { return f.name.match(/.json/i); });
		
		var p1 = Sim.ParseFile(json, this.ParseJSONFile.bind(this, simulation));


		var defs = [p1];
		
		var defsdata = Promise.all(defs).then((data) => {
			return (data[0].result);
		});	
		
			
	defsdata.then(function(result) {
 		d.Resolve(result);
		});
	
		return d.promise;
	}



ParseJSONFile(simulation, chunk, progress) {		
	var split = chunk.split(',"');

	var svgUrl = split[0].split('":')[1].replace('"','').replace('"','');
	var transitionCsvUrl = split[1].split(':"')[1].replace('"','');
	var size = split[2].split(':')[1];
	 this.simulatorName = split[3].split(':"')[1].replace('"','');
	 this.simulator = split[4].split(':"')[1].replace('"','');
	var palette = split[5].split(':')[1].replace('}','');

	simulation.size = size;
fetch(svgUrl)
 			.then(results => {
  				 return results.json();
  				})
  			.then(data => {
  				this.ParseSVGFile(simulation, data.files["SVGfile.svg"].content);
   			
  			});	

var c = fetch(transitionCsvUrl)
 			.then(results => {
  				 return results.json();
  				})
  			.then(data => {
  				var x = this.ParseCSVFile(data.files["CSVfile.csv"].content, simulation);
  				return x;
  			});
  			
  			this.Emit("Progress", { progress: progress });
		return c;
		}
	
ParseCSVFile( transitionCsv, simulation) {		
		this.transition = transitionCsv;

		var lines= [];

		lines = (transitionCsv.split("\n"));

		var i =1;
		Array.ForEach(lines, function(line) { 
			var split = line.split(",");

			// Parse model id
			var model = split[1];		
			var state = split[2];
			var input = split[3];
			var output = split[4];
			var error = split[5];
			var phase = split[6];

			
			//Parse state value, timestamp used as frame id
			var v = parseFloat(split[4]);
			var fId = split[0];
						
			var f = simulation.Index(fId) || simulation.AddFrame(new Frame(fId));
			//f.AddTransition(new Transition(state, v));
			f.AddTransition(new TransitionCSV(fId, model, state,input, output,error,phase));
		

		var modelsArray = []; 

		modelsArray.push(model);
		var j = 0,k=0;
        var count = 0; 
        var start = false; 
          
        for (j = 0; j < modelsArray.length; j++) { 
            for (k = 0; k < this.models.length; k++) { 
                if ( modelsArray[j] == this.models[k] ) { 
                    start = true; 
                } 
            } 
            count++; 
            if (count == 1 && start == false) { 
                this.models.push(modelsArray[j]); 
            } 
            start = false; 
            count = 0; 
        } 
        simulation.models = this.models;

		}.bind(this));
	


var info = {
				simulator : this.simulator,
				name : this.simulatorName,
				files : this.files,
				lastFrame : simulation.LastFrame().time,
				nFrames : simulation.frames.length
			}
			
			
			simulation.Initialize(info, this.settings);
			const returnedTarget = Object.assign(this.simulationX, simulation);
			return returnedTarget;
		}
ParseSVGFile(simulation, SVGfile)
{
	simulation.svg = SVGfile;
}	
}