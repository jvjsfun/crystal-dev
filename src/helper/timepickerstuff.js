          selectedItem : 25,
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
            ]
   <Picker style={{width: 150, height: 180}}
          selectedValue={this.state.selectedItem}
          itemStyle={{color:"white", fontSize:26}}
          onValueChange={(index) => this._onPickerSelect(index)}>
            {this.state.itemList.map((value, i) => (
              <PickerItem label={this._pickerItemToString(value)} value={i} key={"time = "+this._pickerItemToString(value)}/>
            ))}
        </Picker>
  _onPickerSelect(index){

      this.setState({
        selectedItem: index,
      })
      
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