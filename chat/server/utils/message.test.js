const expect= require('expect');
var {generateMessage, generateLocationMessage}= require('./message');
describe('generateMessage',()=>{
  it('generateMessage should work prperly', ()=>{
var from= 'Admin';
var text= 'hey';
var m= generateMessage(from, text);
expect(m.createdAt).toBeA('number');
expect(m).toInclude({from,text});


  });
});
describe('generateLocationMessage',()=>{
  it('generateLocationMessage should work prperly', ()=>{
var from= 'deb';
var latitude= 1;
var longitude=2;
var url= 'https://www.google.com/maps?q=1,2';
var m= generateLocationMessage(from, latitude,longitude);
expect(m.createdAt).toBeA('number');
expect(m).toInclude({from,url});


  });
});
