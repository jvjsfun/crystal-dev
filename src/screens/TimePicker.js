import React, { Component } from 'react';
import {
  // Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Dimensions,
  SectionList,
  Picker,
} from 'react-native';
var {height, width} = Dimensions.get('window');

class TimePicker extends Component{
	  static navigationOptions = {
	        gesturesEnabled: false
	  }
	constructor(props){
		super(props)

		
		
		//This code was written using a code generator in python when I was just learning RN and didn't know how to use Picker whatsoever.
		//Please change it if you want. It is disgusting.
		this.state = {
			visible:true,
			selectedTime: 0 ,
		
          	timePickerData:[
	            {
	            hours : '12',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '12',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '1',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '1',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '2',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '2',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '3',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '3',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '4',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '4',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '5',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '5',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '6',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '6',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '7',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '7',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '8',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '8',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '9',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '9',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '10',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '10',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '11',
	            minutes : '00',
	            AMPM : 'AM',
	            },
	            {
	            hours : '11',
	            minutes : '30',
	            AMPM : 'AM',
	            },
	            {
	            hours : '12',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '12',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '1',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '1',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '2',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '2',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '3',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '3',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '4',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '4',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '5',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '5',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '6',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '6',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '7',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '7',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '8',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '8',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '9',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '9',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '10',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '10',
	            minutes : '30',
	            AMPM : 'PM',
	            },
	            {
	            hours : '11',
	            minutes : '00',
	            AMPM : 'PM',
	            },
	            {
	            hours : '11',
	            minutes : '30',
	            AMPM : 'PM',
	            }
            ],
            earliestTime:0,
            timeType:"specific",
            vagueTimeSelected:"Now",
            today:true,
            // selectedItem:"5:00,
		}
		
		// this.componentWillReceiveProps(props);		
	}

	/*
		<View style = {styles.row}>
			<Text style = {styles.topText}>
				Time
			</Text>
			<View style = {{flex:1,flexDirection:'row'}}/>

		</View>
	*/

	componentDidMount(){
		let props = this.props;
		this.processProps(props);
		
	}

	componentWillReceiveProps(props){
		// console.log("receiving props");
		// console.log(props);
		this.processProps(props);
		
	}

	processProps(props){
		// console.log(props);
		let earliestTime = 0;
		if(this.state.timeType === "vague"){
			let time = this.state.vagueTimeSelected;
			if(!props.today){
				if(time === "Now" || time === "Soon"){
					time = "Whenever";
					let timeData = {};
					timeData.type = "vague";
					timeData.timeString = time;
					this.props.setTime(timeData);
				}
			}
			let timeData = {};
			timeData.type = "vague";
			timeData.timeString = time;
			this.setState({vagueTimeSelected:time, today:props.today});
			// this.props.setTime(timeData);
			
		}
		else if(props.today){
			// console.log("today");
			if(this.state.earliestTime != 0){
				return;
			}
			earliestTime = 1 + new Date().getHours() * 2 + (new Date().getMinutes() > 30 ? 1 : 0);
			if(earliestTime >= this.state.timePickerData.length){
				earliestTime = this.state.timePickerData.length - 1;
			}
			this.setState({selectedTime:0, earliestTime:earliestTime, today:true});
			let timeData = this.state.timePickerData[earliestTime];
			timeData.type = "specific";
			this.props.setTime(timeData)
			// console.log(earliestTime);
		}
		else{
			// console.log("not today");
			if(this.state.earliestTime == 0){
				return;
			}
			let state = this.state;
			state.selectedTime = this.state.earliestTime + this.state.selectedTime;
			state.earliestTime = 0;
			state.today = false;
			this.setState(state);
			let timeData = this.state.timePickerData[earliestTime+state.selectedTime];
			timeData.type = "specific";
			this.props.setTime(timeData)
			// console.log(earliestTime);
		}



	}

	render(){
		// console.log("rerendering"); 
		
		
		let timePickerData = this.state.timePickerData.slice(this.state.earliestTime);
		// console.log(timePickerData)
		if(this.state.visible){
			if(this.state.timeType === "specific"){
				let items = timePickerData.map( (s, i) => {
	            	return <Picker.Item key={i} color = '#f9264f' value={this._pickerItemToString(s)} label={this._pickerItemToString(s)} />
	        	});

				return(
					<View style = {styles.time}>
						
						<Picker
						  // style = {styles.time}
						  style = {{flex:1}}
						  itemStyle = {styles.itemStyle}
				          selectedValue={this._pickerItemToString(timePickerData[this.state.selectedTime])}
				          onValueChange={(itemValue, itemIndex) => this.setTime(itemIndex,timePickerData)}
				          itemTextStyle = {styles.itemTextStyle}
				          timeType = {this.state.timeType}
				        >
				           {items}

				        </Picker>

				        <View style = {styles.divider}/>

				        <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" style = {{height:height*0.075, alignItems:'center', justifyContent:'center'}} onPress = {()=>this.switchTimeType("vague")}>
				        	<Text style = {styles.itemTextStyle}>
				        		SELECT TIME OF DAY
				        	</Text>
				        </TouchableHighlight>
			        </View>
				)					
			}
			else if(this.state.timeType === "vague"){
				return(
					<View style = {styles.time}>
						<View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>

						{this.renderTopButtons()}

						<View style = {styles.row}>
							<TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.setVagueTime("Morning")} style = {this.state.vagueTimeSelected === "Morning" ? styles.filterButtonSelected : styles.filterButton}>
								<Text style = {this.state.vagueTimeSelected === "Morning" ? styles.filterButtonSelectedText : styles.filterButtonText}>
									Morning
								</Text>
							</TouchableHighlight>

							<TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.setVagueTime("Afternoon")} style = {this.state.vagueTimeSelected === "Afternoon" ? styles.filterButtonSelected : styles.filterButton}>
								<Text style = {this.state.vagueTimeSelected === "Afternoon" ? styles.filterButtonSelectedText : styles.filterButtonText}>
									Afternoon
								</Text>
							</TouchableHighlight>

							<TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.setVagueTime("Evening")} style = {this.state.vagueTimeSelected === "Evening" ? styles.filterButtonSelected : styles.filterButton}>
								<Text style = {this.state.vagueTimeSelected === "Evening" ? styles.filterButtonSelectedText : styles.filterButtonText}>
									Evening
								</Text>
							</TouchableHighlight>
						</View>
						</View>

						<View style = {styles.divider}/>

				        <TouchableHighlight underlayColor="rgba(255,255,255,0.1)" style = {{height:height*0.075, alignItems:'center', justifyContent:'center'}} onPress = {()=>this.switchTimeType("specific")}>
				        	<Text style = {styles.itemTextStyle}>
				        		SELECT SPECIFIC TIME
				        	</Text>
				        </TouchableHighlight>
					</View>
				)
			}
		}
		return(
			<View style = {styles.addTime}>
				<TouchableHighlight underlayColor='#fff' onPress = {()=>this.addTime(timePickerData)}>
					<Text style = {styles.submit}>
						+ Add Time
					</Text>
				
				</TouchableHighlight>
			</View>
		)
	}
    _pickerItemToString(item){
	    let pickerString = "";
	    pickerString += item.hours;
	    pickerString += ":"
	    pickerString += item.minutes;
	    pickerString += " "
	    pickerString += item.AMPM;
	    return pickerString;
	}

	renderTopButtons(){

		if(this.state.today){
			return(
				<View style = {styles.row}>
					<TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.setVagueTime("Now")} style = {this.state.vagueTimeSelected === "Now" ? styles.filterButtonSelected : styles.filterButton}>
						<Text style = {this.state.vagueTimeSelected === "Now" ? styles.filterButtonSelectedText : styles.filterButtonText}>
							Now
						</Text>
					</TouchableHighlight>

					<TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.setVagueTime("Soon")} style = {this.state.vagueTimeSelected === "Soon" ? styles.filterButtonSelected : styles.filterButton}>
						<Text style = {this.state.vagueTimeSelected === "Soon" ? styles.filterButtonSelectedText : styles.filterButtonText}>
							Soon
						</Text>
					</TouchableHighlight>

					<TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.setVagueTime("Whenever")} style = {this.state.vagueTimeSelected === "Whenever" ? styles.filterButtonSelected : styles.filterButton}>
						<Text style = {this.state.vagueTimeSelected === "Whenever" ? styles.filterButtonSelectedText : styles.filterButtonText}>
							Whenever
						</Text>
					</TouchableHighlight>
				</View>			
			);
		}
		else{
			return(
				<View style = {styles.row}>
					<TouchableHighlight underlayColor="rgba(255,255,255,0.1)" onPress = {()=>this.setVagueTime("Whenever")} style = {this.state.vagueTimeSelected === "Whenever" ? styles.filterButtonSelected : styles.filterButton}>
						<Text style = {this.state.vagueTimeSelected === "Whenever" ? styles.filterButtonSelectedText : styles.filterButtonText}>
							Whenever
						</Text>
					</TouchableHighlight>
				</View>			
			);
		}
	}

	switchTimeType(timeType){
		this.setState({timeType:timeType});
		if(timeType === "specific"){
			let timeData = this.state.timePickerData[this.state.earliestTime+this.state.selectedTime];
			timeData.type = "specific";
			this.props.setTimeType("specific");
			this.props.setTime(timeData)
		}
		else if(timeType === "vague"){
			let timeData = {};
			timeData.type = "vague";
			timeData.timeString = this.state.vagueTimeSelected;
			if(!this.props.today){
				if(timeData.timeString === "Now" || timeData.timeString === "Soon"){
					timeData.timeString = "Whenever"
				}
			}
			this.props.setTimeType("vague");
			this.props.setTime(timeData);


			this.setState({vagueTimeSelected:timeData.timeString, today:this.props.today});

		}
	}

	setTime(itemIndex,timePickerData){
		this.setState({selectedTime:itemIndex})
		// console.log(itemIndex);
		let timeData = timePickerData[itemIndex];
		timeData.type = "specific";
		this.props.setTime(timeData);
	}

	setVagueTime(vagueTime){
		// console.log(this.state.vagueTimeSelected);
		// console.log(vagueTime);
		let state = this.state;
		state.vagueTimeSelected = vagueTime;
		this.setState(state);
		// console.log(this.state.vagueTimeSelected);
		let timeData = {};
		timeData.timeString = vagueTime;
		timeData.type = "vague";
		this.props.setTime(timeData);
	}

	cancelTime(){
		this.setState({visible:false})
		this.props.setTime(false)
	}

	addTime(timePickerData){
		this.setState({visible:true})
		this.props.setTime(timePickerData[this.state.selectedTime])
	}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4c1319',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    //marginTop:
  },

  topText:{
  	fontSize:14,
  	color:'#f9264f',
  	marginLeft:10,
  	marginRight:10,
  	fontWeight:'bold'
  },

  end:{
    flex:1,
    justifyContent:'flex-end',
  },

  row:{
    // marginTop:10,
    flex:0,
    flexDirection : 'row',
    alignItems: 'center',
    justifyContent:'center',

  },

  cancelButton:{
    height:height*0.09,
    backgroundColor:'#fff',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },

  cancelText:{
    fontSize:30,
    textAlign:'center',
    color:'#a8a8a8',
  },

  acceptButton:{
    height:height*0.09,
    backgroundColor:'#f9264f',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  acceptText:{
    fontSize:30,
    textAlign:'center',
    color:'#fff',
  },

  header: {
    fontSize: 20,
    marginVertical: 20,
  },
  submit:{
    marginLeft:10,
    color:'#f9264f',
    textAlign:'left',
    fontSize:20,
    // fontWeight:'bold',
  },
  time:{
    borderRadius:7.5,
    // height:height*0.23,
    flex:1,
    marginTop : 10,
    // marginBottom:10,
    backgroundColor:'#fff',
	marginRight:10,
    marginLeft:10,
  },
  addTime:{
    borderRadius:10,
    flex:2.2,
    marginTop : 10,
    backgroundColor:'#fff',
    marginRight:20,
    marginLeft:20,
    // marginBottom:10,
    // fontWeight:'bold',
    alignItems:'center',
    justifyContent:'center',
  },
  itemStyle:{
  	color:'#f9264f',
  	fontWeight:'bold',
  	flex:1,
  },
  itemTextStyle:{
  	color:'#f9264f',
  	fontWeight:'bold',
  	fontSize:height*0.023,
  },

  textBox:{
    marginRight:20,
    marginLeft:20,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:'#fff',
    borderRadius:10,	
    borderWidth: 1,
    borderColor: '#fff',
  },

  quickSelect:{
    borderRadius:10,
    height:height*0.5,
    marginTop : 10,
    backgroundColor:'#fff',
    marginRight:20,
    marginLeft:20,
  },

  calendar:{
    borderRadius:10,
    height:height*0.5,
    backgroundColor:'#fff',
    marginRight:25,
    marginLeft:25,
    borderWidth:0,
    borderColor:'#fff',
  },



  submitText:{

      marginLeft:10,
      color:'#a8a8a8',
      textAlign:'left',
      fontSize:20
  },

  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f9264f',
    borderBottomWidth:1,
    borderBottomColor:"#CED0CE",
  },

  item: {
    borderRadius:5,
    // borderColor:'#efefef',
    borderColor:'#f9264f',
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#f9264f',
    marginLeft:width/20,
  },

  filterButton:{
    marginRight:2.5,
    marginLeft:2.5,
    marginTop:7.5,
    marginBottom:7.5,
    backgroundColor:'#fff',
    borderRadius:6,
    borderWidth: 1,
    borderColor: '#f9264f',
    paddingTop:5,
    paddingBottom:5,
    paddingRight:5,
    paddingLeft:5,
    alignItems:'center',
    justifyContent:'center',
    flex:1,
  },
  filterButtonText:{
    color:'#f9264f',
    fontSize:height*0.029,
    fontWeight:'bold',
  },
  filterButtonSelected:{
    marginRight:2.5,
    marginLeft:2.5,
    marginTop:7.5,
    marginBottom:7.5,
    backgroundColor:'#f9264f',
    borderRadius:6,
    borderWidth: 1,
    borderColor: '#fff',
    paddingTop:5,
    paddingBottom:5,
    paddingRight:5,
    paddingLeft:5,
    alignItems:'center',
    justifyContent:'center',
    flex:1,
  },

  filterButtonSelectedText:{
    color:'#fff',
    fontSize:height*0.029,
    fontWeight:'bold',
  },

  divider:{
    borderBottomColor:'#e4e4e4',
    borderBottomWidth:1,
  },



});
export default TimePicker