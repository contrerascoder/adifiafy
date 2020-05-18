<template>
  <remote-data url="/events/lastevent">
    <template v-slot:data="{data}">
      <v-card
        class="ma-4"
        outlined
        color="info"
        dark
      >
        <v-card-title primary-title>
          <div>
            <h3 class="display-3">
              PROXIMO EVENTO DE ADIFIA
            </h3>
          </div>
        </v-card-title>
        <v-card-text>
          <h2>{{ data.title }}</h2>
          <p>{{ data.body }} ({{ data.place }})</p>
          <div class="d-flex justify-end">
            <span>{{ data.datetime | standardDate }}</span>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </remote-data>
</template>
