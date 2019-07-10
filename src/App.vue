<template>
	<Layout id="shinny-app">
		<Content class="content">
			<router-view></router-view>
		</Content>
	</Layout>
</template>
<script>
  export default {
    mounted: function () {
      this.$on('tqsdk:notify', function (notify) {
        if (!this.$store.state.logined) return
        if (notify.level === 'INFO') {
          if (notify.type === 'SETTLEMENT') {
            this.$store.commit('SET_SETTLEMENT', notify)
          } else if (notify.type === 'MESSAGE') {
            this.$Message.info(notify.content)
          }
        } else if (notify.level === 'WARNING' || notify.level === 'ERROR') {
          this.$Message.error(notify.bid + ' ' + notify.user_id + '\n' + notify.content)
        }
      })
      if (!this.$store.state.logined) {
        this.$router.push({ path: '/login' })
      }
    }
  }
</script>

<style lang="scss">
	html,
	body {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	#shinny-app {
		height: 100%;
		width: 100%;
		overflow: hidden;
		position: absolute;

		> .sider {
			overflow-x: hidden;
			background-color: #ffffff;
			text-align: center;
			border-right: 6px solid #f3f3f3;
			&::-webkit-scrollbar {
				width: 0 !important;
				height: 0 !important;
			}
		}

		> .content {
			height: 100%;
			overflow: hidden;
			background-color: #ffffff;
			&::-webkit-scrollbar {
				width: 0 !important;
				height: 0 !important;
			}
			.split-horizontal {
				width: 100%;
				height: 6px;
				background-color: #f3f3f3;
				cursor: row-resize;
				.split-horizontal-dots {
					left: 50%;
					top: 1px;
					width: 40px;
					position: absolute;
					overflow: hidden;
					.dot {
						background-color: darken(#f3f3f3, 30%);
						height: 4px;
						width: 4px;
						border-radius: 2px;
						float: left;
						margin-right: 3px;
					}
				}
			}

			.split-pane {
				height: 100%;
			}
		}

		// fix iview bug 水平分割块
		.ivu-split-horizontal > .ivu-split-trigger-con {
			height: 100%;
			width: 0;
		}
	}
</style>
