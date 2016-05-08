import {Component, Input} from "@angular/core";

import {Player} from '../models/player';

@Component({
  selector: "status",
  templateUrl: "/static/main-hall/templates/status.html",
})
export class StatusComponent {
  @Input() player;
}