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
		
		this.parsedValues = [];
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
	
	Parse(files) {
		var d = Lang.Defer();
		
		
		var txt = Array.Find(files, function(f) { return f.name.match(/.csv/i); });
		//var svg = Array.Find(files, function(f) { return f.name.match(/.svg/i); });

		var p1 = Sim.ParseFile(txt, this.ParseTxtFile.bind(this));
		//var p2 = Sim.ParseFile(svg, this.ParseSVGFile.bind(this));

		var defs = [p1];
	
		Promise.all(defs).then((data) => {
			
			var info = {
				simulator : "CSV",
				name : txt.name.replace(/\.[^.]*$/, ''),
				files : files,
			
			}
			
			//this.size = this.ma.models.length;
			//this.models = this.ma.models;
			//this.svg=this.svg;
			//simulation.Initialize(info, settings);

			d.Resolve();
		});
		
		return d.promise;
	}

	
	
}