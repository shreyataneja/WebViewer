'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Widget from '../../ui/widget.js';

export default Lang.Templatable("Diagram.DevsDiagram", class DevsDiagram extends Widget { 

	constructor() {
		super();
	}
	
	SetSVG(svg) {
if (svg != null)
		{
			this.Node('diagram').innerHTML = svg;
			this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("width", "100%");
				this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("height", "100%");
				this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("viewbox", "0 0 560 340"); // as per the cell dimesions 
				this.Node("diagram").getElementsByTagName("svg")[0].setAttribute("preserveAspectRatio", "none");
				this.Node("diagram").getElementsByTagName("title").hidden = true;
				
			var models = this.Node('diagram').querySelectorAll("[model]");
			
			this.models = {};
			
			Array.ForEach(models, function(model) {
				var id = model.getAttribute("model");
				
				model.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
				model.addEventListener("click", this.onSvgClick_Handler.bind(this));
				model.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
				
				this.models[id] = {
					svg : model,
					fill : model.getAttribute("fill"),
					stroke : model.getAttribute("stroke"),
					width : model.getAttribute("stroke-width")
				}
			}.bind(this));
	}
else
{
this.Node('diagram').innerHTML = 'No SVG Found';	
		}
}
	
	onSvgMouseMove_Handler(ev) {
		var model = ev.target.getAttribute('model');
		
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY , model:model });
	}
		
	onSvgMouseOut_Handler(ev) {
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY });
	}
	
	onSvgClick_Handler(ev) {
		var model = ev.target.getAttribute('model');
		
		this.Emit("Click", { x:ev.pageX, y:ev.pageY , model:this.models[model] ,modelid:model});
	}
		
	DrawModel(model, input, output, fill, stroke, width) {
		if (model != null)
		{		if (fill) model.svg.setAttribute('fill', fill);
				if (stroke) model.svg.setAttribute('stroke', stroke);
				if (width) model.svg.setAttribute('stroke-width', width);
		}
		if (input != null)
		{	
			if (stroke) input.svg.setAttribute('stroke', stroke);
			if (width) input.svg.setAttribute('stroke-width', width);
		}
		if (output != null)
		{	
			if (stroke) output.svg.setAttribute('stroke', stroke);
			if (width) output.svg.setAttribute('stroke-width', width);
		}
	}
	
	ResetModel(model) {

		model.svg.setAttribute('fill', model['fill']);
		model.svg.setAttribute('stroke', model['stroke']);
		model.svg.setAttribute('stroke-width', model['stroke-width']);
	}
	
	Template() {
		return "<div class='devs-diagram'>" + 
		 	      "<div handle='title' class='devs-diagram-title'>nls(DevsDiagram_Title)</div>" + 
				  "<div handle='diagram-container' class='devs-diagram-container'>" +
					"<div handle='diagram' ></div>" +
				  "</div>" + 
			   "</div>";
	}

	Resize() {
		this.size = Dom.Geometry(this.Node("diagram-container"));
		
		var pH = 30;
		var pV = 30;
		
		this.Node("diagram").style.margin = `${pV}px ${pH}px`;
		this.Node("diagram").style.width = `${(this.size.w - (30))}px`;	
		this.Node("diagram").style.height = `${(this.size.h - (30))}px`;
	}
	
	Draw(state) {

	}

	DrawChanges(state) {

		for (var id in this.models) this.ResetModel(this.models[id]);
		
		//TO DRAW INITIAL STATE AFTER SHOWING THE CHANGES.
		var transitions = this.data.transitions[state.i];
	
		Array.ForEach(transitions, function(t) {
			var m = this.models[t.id];
			var i = this.models[t.input];
			var o = this.models[t.output];
			
			if (t.phase == 'inactive' ) m = null;
			
			// TODO : style should come from auto wrapper.
			
			this.DrawModel(m, i, o, 'LightSeaGreen', null, 4.0);

		}.bind(this));
	
	}

	Data(data) {
		this.data = data;
	}
});