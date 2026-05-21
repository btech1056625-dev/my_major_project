import {Subscription} from "../models/subscription.model.js" 
import {asynchandler} from '../utils/asynchandler.js';

const subscribeToChannel = asynchandler(async (req, res) => {  