<template>
  <patient-form :is-edit="true" />
</template>

<script>
import PatientForm from '@/views/patient/patientForm'

export default {
  name: 'CreatePatient',
  components: { PatientForm }
}
</script>

<style scoped>

</style>
