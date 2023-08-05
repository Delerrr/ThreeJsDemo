<template>
  <div class="v-card">
    <div class="c-title">
      <div class="c-t-content">
        <div class="c-t-c-center">
          模型详情
        </div>
      </div>
    </div>
    <div class="c-content sbxq-content">
      <div class="s-label">
        <div class="s-l-flag" />
        <div class="s-l-text">
          模型位置
        </div>
      </div>
      <div class="s-content">
        <div class="s-c-item">
          <div class="s-c-i-label">
            <span>x</span>
          </div>
          <div class="s-c-i-value" style="color: #FF4747">
            <slot name="x"></slot>
          </div>
          <div class="s-c-item">
            <div class="s-c-i-label">
              <span>y</span>
            </div>
            <div class="s-c-i-value" style="color: #FF4747">
              <slot name="y"></slot>
            </div>
          </div>
          <div class="s-c-item">
            <div class="s-c-i-label">
              <span>z</span>
            </div>
            <div class="s-c-i-value" style="color: #FF4747">
              <slot name="z"></slot>
            </div>
          </div>
        </div>
        <div class="s-c-item">
          <div class="s-c-i-label">
            <span>名称</span>
          </div>
          <div class="s-c-i-value">
            <slot name="name"></slot>
          </div>
        </div>
        <div class="s-c-item">
          <div class="s-c-i-label">
            <span>生产批号</span>
          </div>
          <div class="s-c-i-value">
            S7-10/0.4-500kvA
          </div>
        </div>
        <div class="s-c-item">
          <div class="s-c-i-label">
            <span>投放运营时间</span>
          </div>
          <div class="s-c-i-value">
            2019/12/04 08:30
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../styles/card.scss";

.sbxq-content {
  height: 600px;
  padding-top: 30px !important;

  .s-label {
    height: 30px;
    display: flex;
    align-items: center;

    .s-l-flag {
      width: 4px;
      height: 20px;
      border-radius: 4px;
      background: #428bfe;
      margin-right: 10px;
    }

    .s-l-text {
      font-size: 18px;
      color: #ffffff;
    }
  }

  .s-content {
    padding-top: 10px;
    padding-bottom: 15px;

    .s-c-item {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 14px;
      color: #e4e3e3;
      display: flex;

      .s-c-i-label {
        width: 140px;
        font-size: 18px;
        color: #ffffff;
        // font-weight: bold;
      }

      .s-c-i-value {
        flex: 1;
        font-size: 20px;
        color: #c1c1c1;
      }
    }

    img {
      width: 100%;
      height: 100%;
    }

    .btn {
      font-size: 18px;
      color: #c1c1c1;
      border-bottom: 1px solid #c1c1c1;
      display: inline-block;
      margin-left: 14px;
      cursor: pointer;
    }
  }
}

.v-card {

  .c-title {
    border-left: 2px solid rgba(255, 71, 71, 1) !important;
    border-right: 2px solid rgba(255, 71, 71, 1) !important;

    .c-t-content {
      color: #fff !important;
      background: rgba(106, 253, 76, 0.6) !important;
    }
  }

  .c-content {
    background: rgba(0, 0, 0, 0.8) !important;
  }
}
</style>
