<template>
  <q-page padding>
    <h1 class="q-ma-none q-mb-md text-h3">
      Pravidla hry
    </h1>

    <h2 class="q-ma-none q-mb-md text-h4">Cíl hry</h2>

    <p>Pomocí správných odpovědí propojit jednotlivé strany obrazce, například trojúhelníku.</p>

    <h2 class="q-ma-none q-mb-md text-h4">Typy hry</h2>

    <ul>
      <li>
        trojúhelník, 28 políček
      </li>
      <li>
        trojúhelník, 15 políček
      </li>
    </ul>

    <h2 class="q-ma-none q-mb-md text-h4">Průběh hry</h2>

    <p>
      Prvního hráče vybere systém sám při startu každého z kol.
    </p>
    <p>
      Moderátor přečte otázku. Soutěžící odpoví správně, chybně nebo neví. Na zodpovězení otázky má soutěžící 10 vteřin.
      Podle odpovědi moderátor zvolí akci na svém panelu.
      Hráč se může opravit, do vypršení časového limitu, který hlídá moderátor (časový limit je není povinný).
      <br>
      V případě správné odpovědi se políčko obarví v barvě hráče.
      O políčko s otázkou, na kterou nebyla správná odpověď, je možné nechat o výherci rozhodnout náhodu opětovným kliknutím na políčko (v černé barvě).
      Pokračuje další hráč v řadě, ať už volbu náhodou vyhrál nebo ne.
    </p>

    <h2 class="q-ma-none q-mb-md text-h4">Konec hry</h2>

    <p>
      Moderátor kontroluje, zda-li se hráč dotknul svojí barvou všech stran. Pokud ano, nastaví v moderátorském panelu vítěze, hra končí.
      Je možné nastavit výsledek hry i jako "remízu".
    </p>

    <h2 class="q-ma-none q-mb-md text-h4">Poznámky</h2>

    <ul>
      <li>
        Nepoužité otázky je možné po ukončení kola použít v kole jiném.
      </li>
      <li>
        Moderátor hru kontroluje. Je tedy zcela na něm, jak bude hru ovládat. Pravidla je pak možné si nastavit víceméně individuálně.
      </li>
    </ul>
  </q-page>
</template>

<script>

export default {
}
</script>
