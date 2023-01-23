import { Component, OnInit, Renderer2 } from '@angular/core';
import { ScriptService } from '../../common/script.service';


const scriptPath = 'assets/scripts/address-form-validation.js';

@Component({
  selector: 'app-add-user-address',
  templateUrl: './add-user-address.component.html',
  styleUrls: ['./add-user-address.component.scss']
})
export class AddUserAddressComponent implements OnInit {


  constructor(
    private scriptService: ScriptService,
    private renderer: Renderer2
  ) {

  }

  ngOnInit(): void {
    const scriptElement = this.scriptService.loadJsScript(this.renderer, scriptPath);
    scriptElement.onload = () => {
     console.log('Validation Script load');
      
    }
    scriptElement.onerror = () => {
      console.log('Could not load the Validation Script!');
    }
  }

}
