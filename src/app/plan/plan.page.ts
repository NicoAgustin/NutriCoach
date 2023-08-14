import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {

  miPlan:plan[] = [
    {
      tipo: "Desayuno",
      contenido: "Tostadas con queso"
    },
    {
      tipo: "Almuerzo",
      contenido: "Pollo con ensalada"
    },
    {
      tipo: "Merienda",
      contenido: "Yogurt, frutos secos"
    },
    {
      tipo: "Cena",
      contenido: "Asado con papas fritas"
    },
  ]

  
  constructor() { }

  ngOnInit() {
  }

}

interface plan {
  tipo: string,
  contenido: string
}
