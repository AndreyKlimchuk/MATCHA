import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-input-range/lib/css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import './Matcha.css';
import Matcha from './components/matcha';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import Storage from "./components/storage";

ReactDOM.render((
	<BrowserRouter>
		<Matcha storage = {new Storage()}/>
	</BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
