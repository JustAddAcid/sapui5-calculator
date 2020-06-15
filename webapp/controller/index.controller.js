sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("simpleCalcSimpleCalculator.controller.index", {
		onInit: function() {
			this.viewState = new JSONModel({
				input: "0",
				firstArg: null,
				selectedOperation: null,
				newNumberOnNextInput: false,
				memory: 0
			});
			
			this.stylesState = new JSONModel({
				btnWidth: "50px",
				additionalBtnsWidth: "60px"
			});

			this.view = this.getView();
			this.view.setModel(this.viewState, "viewState");
			this.view.setModel(this.stylesState, "styesState");
			
			this.addViewStateListener("/memory", this.memoryUsage);
		},

		removeLeadingZeros: function(numString) {
			return numString.replace(/^0+/, "");
		},

		appendSymbolToLine: function(event) {
			var input = this.viewState.getProperty("/input");
			var beginNewNumber = this.viewState.getProperty("/newNumberOnNextInput");

			if (beginNewNumber) {
				input = "";
			}
			input += event.getSource().getText();
			input = this.removeLeadingZeros(input);
			this.viewState.setProperty("/input", input ? input : "0");
			this.viewState.setProperty("/newNumberOnNextInput", false);
		},

		calcucate: function(firstArg, secondArg, operation) {
			var firstArgNumber = parseFloat(firstArg);
			var secondArgNumber = parseFloat(secondArg);

			switch (operation) {
				case "+":
					return firstArgNumber + secondArgNumber;
				case "-":
					return firstArgNumber - secondArgNumber;
				case "*":
					return firstArgNumber * secondArgNumber;
				case "/":
					return firstArgNumber / secondArgNumber;
				default:
					return secondArgNumber;
			}
		},

		calcOperation: function(event) {
			var currentOperation = event.getSource().getText();

			var firstArg = this.viewState.getProperty("/firstArg");
			var previousOperation = this.viewState.getProperty("/selectedOperation");
			var input = this.viewState.getProperty("/input");

			if (firstArg !== null && previousOperation !== null) {
				input = this.calcucate(firstArg, input, previousOperation).toString();
			}

			this.viewState.setProperty("/firstArg", input);
			this.viewState.setProperty("/input", input);
			this.viewState.setProperty("/selectedOperation", currentOperation);
			this.viewState.setProperty("/newNumberOnNextInput", true);
		},

		reset: function() {
			this.viewState.setProperty("/input", "0");
			this.viewState.setProperty("/firstArg", null);
			this.viewState.setProperty("/selectedOperation", null);
			this.viewState.setProperty("/newNumberOnNextInput", false);
		},

		setToMemory: function(event) {
			var operation = event.getSource().getText();
			var input = parseFloat(this.viewState.getProperty("/input"));
			var memory = this.viewState.getProperty("/memory");
			
			switch(operation){
				case "M+":
					return this.viewState.setProperty("/memory", memory + input);
				case "M-":
					return this.viewState.setProperty("/memory", memory - input);
			}
		},

		clearMemory: function() {
			var memory = this.viewState.getProperty("/memory");
			this.viewState.setProperty("/input", memory.toString());
			this.viewState.setProperty("/memory", 0);
		},
		
		addViewStateListener: function(path, callback) {
			var oBinding = new sap.ui.model.json.JSONPropertyBinding(this.viewState, path);
			oBinding.attachChange(callback);
		},
		
		memoryUsage: function(event){
			sap.m.MessageToast.show("Memory usage! Set " + event.getSource().getValue());
		}
	});
});