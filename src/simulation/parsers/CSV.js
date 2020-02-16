'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Sim from '../../utils/sim.js';
import Simulation from '../simulation.js';
import Frame from '../frame.js';
import Transition from '../transition.js';
import Parser from "./parser.js";
import ChunkReader from '../../components/chunkReader.js';

export default class CSV extends Parser { 
		
	constructor(fileList) {
		super(fileList); 
		this.frames = [];
		
	}
		
	IsValid() {		
		var d = Lang.Defer();
		var csv = Array.Find(this.files, function(f) { return f.name.match(/.csv/i); });
		//var svg = Array.Find(this.files, function(f) { return f.name.match(/.svg/i); });

		
   		var reader = new ChunkReader();

		reader.ReadChunk(csv, 400).then((ev) => {
			var type = ev.result.match(/type\s*:\s*(.+)/);
			
			d.Resolve(type == null);
		});
  		
		return d.promise;
	}
	
	Parse(files, settings) {
		var d = Lang.Defer();
		var simulation = new Simulation();
		
		var csv = Array.Find(files, function(f) { return f.name.match(/.csv/i); });
		//var svg = Array.Find(files, function(f) { return f.name.match(/.svg/i); });

		var p1 = Sim.ParseFile(csv, this.ParseCSVFile.bind(this, simulation));
		//var p2 = Sim.ParseFile(svg, this.ParseSVGFile.bind(this));

		var defs = [p1];
	
		Promise.all(defs).then((data) => {
			
		var info = {
				simulator : "CSV",
				name : csv.name.replace(/\.[^.]*$/, ''),
				files : files,
				lastFrame : simulation.LastFrame().time,
				nFrames : simulation.frames.length
			}
			

			simulation.csv=this.csv;
			simulation.Initialize(info, settings);

			d.Resolve(simulation);
		});
		
		return d.promise;
	}
ParseCSVFile(simulation, chunk, progress) {		
		var lines= [];
		lines = (chunk.split("\n"));

		var i =1;
		Array.ForEach(lines, function(line) { 
			var split = line.split(",");

			// Parse model id
			var id = split[2].trim();
					
			
			if (id.length < 1) return;
			
			//Parse state value, timestamp used as frame id
			var v = parseFloat(split[4]);
			var fId = split[0].trim();
						
			var f = simulation.Index(fId) || simulation.AddFrame(new Frame(fId));
			
			f.AddTransition(new Transition(id, v));
			
		}.bind(this));
		//console.log(simulation.frames);
		}
	
}