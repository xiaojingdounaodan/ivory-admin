<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './components/CasesDetail'

export default {
  name: 'EditForm',
  components: { ArticleDetail }
}
</script>

