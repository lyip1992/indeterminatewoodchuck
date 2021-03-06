require('dotenv').load();
var db = require('../../../server/models/index.js');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../../index.js');

describe('User Controller', function(){

  beforeEach(function(done){
    db.sequelize.sync({force: true}).then(function(){
      var newOrg = db.Organization.build({
        name: 'Skynet',
        address: 'Cheyenne Mountain',
        city: 'El Paso',
        state: 'Colorodo',
        zip: '80926',
        country: 'USA',
        industry: 'Terminating John Connor',
        password_hash: 'T-1000'
      });
      newOrg.save().then(function(org){
        var newUser = db.User.build({
          first_name: 'Arnold',
          last_name: 'Schwarzennegger',
          OrganizationId: org.id,
          title: 'T-1000',
          email: 'governator@california.gov',
          password_hash: 'terminator'
        });
        newUser.save().then(function(user){
          done();
        });
      });
    });
  });

  it('Should not authenticate users that don\'t exist', function(done){
    request(app)
      .post('/api/users/signin')
      .send({ email: 'ding@dong.com', password: 'dingdong123' })
      .end(function(err, res){
        expect(res.body.success).to.equal('false');
        expect(res.body.message).to.equal('Invalid username.');
        expect(res.headers['set-cookie']).to.not.exist;
        done();
      });
  });

  it('Should not authenticate users that provide invalid passwords', function(done){
    request(app)
      .post('/api/users/signin')
      .send({ email: 'governator@california.gov', password: 'terminate' })
      .end(function(err, res){
        expect(res.body.success).to.equal('false');
        expect(res.body.message).to.equal('Invalid password.');
        expect(res.headers['set-cookie']).to.not.exist;
        done();
      });
  });

  it('Should issue token on a cookie upon successful sign in', function(done){
    request(app)
      .post('/api/users/signin')
      .send({ email: 'governator@california.gov', password: 'terminator' })
      .end(function(err, res){
        expect(res.body.success).to.equal('true');
        expect(res.body.message).to.equal('Enjoy your token!');
        expect(res.headers['set-cookie']).to.exist;
        done();
      });
  });

  it('Should not allow users to sign up with a non-existing organizations', function(done){
    request(app)
      .post('/api/users/signup')
      .send({
        businessName: 'Galactic Empire',
      })
      .end(function(err, res){
        expect(res.body.success).to.equal('false');
        expect(res.body.message).to.equal('Organization does not exist.');
        expect(res.headers['set-cookie']).to.not.exist;
        done();
      });
  });

  it('Should not allow users to sign up with the wrong organization password', function(done){
    request(app)
      .post('/api/users/signup')
      .send({
        businessName: 'Skynet',
        businessPassword: 'T-2000'
      })
      .end(function(err, res){
        expect(res.body.success).to.equal('false');
        expect(res.body.message).to.equal('Wrong organization password.');
        expect(res.headers['set-cookie']).to.not.exist;
        done();
      });
  });

  it('Should not allow users to sign up with an existing email address', function(done){
    request(app)
      .post('/api/users/signup')
      .send({
        email: 'governator@california.gov',
        businessName: 'Skynet',
        businessPassword: 'T-1000'
      })
      .end(function(err, res){
        expect(res.body.success).to.equal('false');
        expect(res.body.message).to.equal('User already exists.');
        expect(res.headers['set-cookie']).to.not.exist;
        done();
      });
  });

  it('Should issue token on a cookie upon successful sign up', function(done){
    request(app)
      .post('/api/users/signup')
      .send({
        firstName: 'Bad',
        lastName: 'Guy',
        jobTitle: 'Terminator',
        email: 'badguy@skynet.com',
        password: 'killjohnconnor',
        businessName: 'Skynet',
        businessPassword: 'T-1000'
      })
      .end(function(err, res){
        expect(res.body.success).to.equal('true');
        expect(res.body.message).to.equal('Enjoy your token!');
        expect(res.headers['set-cookie']).to.exist;
        done();
      });
  });

  it('Should not be able to sign up an existing organization', function(done){
    request(app)
      .post('/api/users/signupwithorg')
      .send({ businessName: 'Skynet' })
      .end(function(err, res){
        expect(res.body.success).to.equal('false');
        expect(res.body.message).to.equal('Organization already exists.');
        expect(res.headers['set-cookie']).to.not.exist;
        done();
      });
  });

  it('Should not be able to sign up an existing user', function(done){
    request(app)
      .post('/api/users/signupwithorg')
      .send({ businessName: 'The Resistance', email: 'governator@california.gov' })
      .end(function(err, res){
        expect(res.body.success).to.equal('false');
        expect(res.body.message).to.equal('User already exists.');
        expect(res.headers['set-cookie']).to.not.exist;
        done();
      });
  });

  it('Should issue token on a cookie upon successful sign up', function(done){
    request(app)
      .post('/api/users/signupwithorg')
      .send({
        firstName: 'Darth',
        lastName: 'Vader',
        jobTitle: 'Dark Lord',
        email: 'darthvader@deathstar.com',
        password: 'ihatetheemperor',
        businessName: 'Galactic Empire',
        businessPassword: 'ihatejedi',
        address: 'Death Star',
        city: 'N/A',
        state: 'N/A',
        zip: 'N/A',
        country: 'N/A',
        industry: 'ruling the galaxy'
      })
      .end(function(err, res){
        expect(res.body.success).to.equal('true');
        expect(res.body.message).to.equal('Enjoy your token!');
        expect(res.headers['set-cookie']).to.exist;
        done();
      });
  });
});
