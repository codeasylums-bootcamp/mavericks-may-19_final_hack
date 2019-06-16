const expect= require('expect');
const {Users}= require('./users.js');


describe('Users', ()=>{
var users;
beforeEach(()=>{
  users= new Users();
  users.users=[{
    id: '1',
    name: 'Mike',
    room: 'node course'
  },{
    id: '2',
    name: 'Jen',
    room: 'react course'
  },{
    id: '3',
    name: 'Jenny',
    room: 'node course'
  }]
});


  it('should add anew user',()=>{
    var users= new Users();
    var user={id: '123',
    name: 'Jaishree',
    room: 'A'

    }
  var resUser=  users.addUser(user.id, user.name, user.room);
  expect(users.users).toEqual([user]);
  });
  it('should remove a user',()=>{
var resUser= users.removeUser('2');
expect(resUser.id).toBe('2');
expect(users.users.length).toBe(2);
  });

  it('should not remove a user',()=>{
    var resUser= users.removeUser('5');
    expect(resUser).toNotExist();
    expect(users.users.length).toBe(3);

  });
   it('should find a user',()=>{
      var resUser= users.getUser('3');
      expect(resUser.id).toBe('3');
    });
     it('should not find a user',()=>{
       var resUser= users.getUser('99');
       expect(resUser).toNotExist();
      });
  it('should return names for node course',()=>{
    var userList=users.getUserList('node course');
    expect(userList).toEqual(['Mike','Jenny']);
  });
  it('should return names for react course',()=>{
    var userList=users.getUserList('react course');
    expect(userList).toEqual(['Jen']);
  });
});
