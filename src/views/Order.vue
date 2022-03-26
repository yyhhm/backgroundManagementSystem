<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-select @change="handleOption"
                   v-model="orderStatus"
                   size="small"
                   style="width: 200px; margin-right: 10px">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <!-- <el-button type="primary" size="small" icon="el-icon-edit">修改订单</el-button> -->
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-home"
                   @click="handleConfig()">配货完成</el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-s-home"
                   @click="handleSend()">出库</el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-circle-close"
                   @click="handleClose()">关闭订单</el-button>
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   @click="handleRefund()">同意退款</el-button>
      </div>
    </template>
    <el-table v-loading="loading"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column prop="orderNo"
                       label="订单号"
                       width="200">
      </el-table-column>
      <el-table-column prop="totalPrice"
                       label="订单总价"
                       width="120">
      </el-table-column>
      <el-table-column prop="orderStatus"
                       label="订单状态"
                       width="120">
        <template #default="scope">
          <span>{{scope.row.orderStatus | orderMap }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式"
                       width="120">
        <template #default='scope'>
          <span v-if="scope.row.payType == 1">微信支付</span>
          <span v-else-if="scope.row.payType == 2">支付宝支付</span>
          <span v-else>未支付</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template #default='scope'>
          {{scope.row.createTime | time}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm v-if="scope.row.orderStatus == 1"
                         title="确定配货吗？"
                         @confirm="handleConfig(scope.row.orderId)"
                         class="pr-10">
            <template slot="reference">
              <el-button type="text">配货</el-button>

            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.orderStatus == 2"
                         title="确定出库吗？"
                         @confirm="handleSend(scope.row.orderId)"
                         class="pr-10">
            <template #reference>
              <el-button type="text">出库</el-button>

            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.orderStatus == 0 "
                         title="确定关闭订单吗？"
                         @confirm="handleClose(scope.row.orderId)"
                         class="pr-10">
            <template #reference>
              <el-button type="text">取消订单</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.orderStatus == -3 "
                         title="确定退款吗？"
                         @confirm="handleRefund(scope.row.orderId)"
                         class="pr-10">
            <template #reference>
              <el-button type="text">同意退款</el-button>
            </template>
          </el-popconfirm>
          <router-link :to="{ path: '/orderDetail', query: { orderId: scope.row.orderId }}">
            <el-button type="text">订单详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <div class="block">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10,20,30,40]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
    name: 'Order',
    data() {
        return {
            orderStatus: '', // 订单状态
            loading: true,
            tableData: [], // 数据列表
            multipleSelection: [], // 选中项
            total: 0, // 总条数
            currentPage: 1, // 当前页
            pageSize: 10, // 分页大小
            options: [
                {
                    value: '',
                    label: '全部',
                },
                {
                    value: 0,
                    label: '待支付',
                },
                {
                    value: 1,
                    label: '已支付',
                },
                {
                    value: 2,
                    label: '配货完成',
                },
                {
                    value: 3,
                    label: '出库成功',
                },
                {
                    value: 4,
                    label: '交易成功',
                },
                {
                    value: -1,
                    label: '手动关闭',
                },
                {
                    value: -2,
                    label: '商家关闭',
                },
                {
                    value: -3,
                    label: '用户退款',
                },
                {
                    value: -4,
                    label: '退款成功',
                },
            ],
        }
    },
    methods: {
        handleConfig(id) {
            let ids = []
            if (this.multipleSelection.length > 0 || id) {
                if (id) {
                    ids.push(id)
                } else {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        if (this.multipleSelection[i].orderStatus !== 1) {
                            this.$message.error('有些订单状态不是已支付')
                            return
                        }
                    }

                    ids = this.multipleSelection.map((item) => item.orderId)
                }
                this.$axios
                    .put(`/order/${2}`, {
                        ids,
                    })
                    .then(() => {
                        this.$message.success('配货成功')
                        this.getOrderList()
                    })
            } else {
                this.$message.error('请选择项')
                return
            }
        },
        handleSend(id) {
            let ids = []
            if (this.multipleSelection.length > 0 || id) {
                if (id) {
                    ids.push(id)
                } else {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        if (this.multipleSelection[i].orderStatus !== 1) {
                            this.$message.error('有些订单状态不是已支付')
                            return
                        }
                    }
                    ids = this.multipleSelection.map((item) => item.orderId)
                }
                this.$axios
                    .put(`/order/${3}`, {
                        ids,
                    })
                    .then(() => {
                        this.$message.success('出库成功')
                        this.getOrderList()
                    })
            } else {
                this.$message.error('请选择项')
                return
            }
        },
        handleClose(id) {
            let ids = []
            if (this.multipleSelection.length > 0 || id) {
                if (id) {
                    ids.push(id)
                } else {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        if (!this.multipleSelection[i].orderStatus === 0) {
                            this.$message.error(
                                '某些订单状态不是未支付，不能关闭'
                            )
                            return
                        }
                    }
                    ids = this.multipleSelection.map((item) => item.orderId)
                }
                this.$axios
                    .put(`/order/${-2}`, {
                        ids,
                    })
                    .then(() => {
                        this.$message.success('关闭成功')
                        this.getOrderList()
                    })
            } else {
                this.$message.error('请选择项')
                return
            }
        },
        handleRefund(id) {
            let ids = []
            if (this.multipleSelection.length > 0 || id) {
                if (id) {
                    ids.push(id)
                } else {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        if (this.multipleSelection[i].orderStatus !== -3) {
                            this.$message.error(
                                '某些订单状态，不是用户退款状态，不能退款'
                            )
                            return
                        }
                    }
                    ids = this.multipleSelection.map((item) => item.orderId)
                }
                this.$axios
                    .put(`/order/${-4}`, {
                        ids,
                    })
                    .then(() => {
                        this.$message.success('商家退款成功')
                        this.getOrderList()
                    })
            } else {
                this.$message.error('请选择项')
                return
            }
        },

        handleOption() {
            this.currentPage = 1
            this.getOrderList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getOrderList()
        },

        // 监听pagenum改变事件
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getOrderList()
        },
        getOrderList() {
            this.$axios('/orders/list', {
                params: {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    orderStatus: this.orderStatus,
                },
            }).then((res) => {
                this.tableData = res.data.list
                this.total = res.data.total
                this.loading = false
            })
        },
    },
    created() {
        this.getOrderList()
    },
}
</script>

<style lang="less" scoped>
.pr-10 {
    padding-right: 10px;
}
</style>
