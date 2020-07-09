import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: '0f3d0a870c364e2f9449e92391dca07d'
 });

const particles = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  calculateFaceLocation = (data) => {
    const faceBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      left: faceBox.left_col * width,
      top: faceBox.top_row * height,
      right: width - (faceBox.right_col * width),
      bottom: height - (faceBox.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input })
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signedout') {
      this.setState({ isSignedIn: false });
    } else if(route === 'home') {
      this.setState({ isSignedIn: true });
    }

    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state
    return (
        <div className="App">
          <Particles
            className='particles'  
            params={particles}/>
          <Navigation onRouteChange={ this.onRouteChange} isSignedIn={ isSignedIn }/>
          { route === 'home' 
            ? <div> 
                <Logo />
                <Rank />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onSubmit={this.onSubmit}  
                />
                <FaceRecognition box={ box } imageUrl={ imageUrl } />
              </div>          
            : (route === 'signin' 
              ? <Signin onRouteChange={ this.onRouteChange } />
              : <Register onRouteChange={this.onRouteChange} />
              ) 
          }
        </div>
      );
  }
}

export default App;
