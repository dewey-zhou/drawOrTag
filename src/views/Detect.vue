<template>
  <div >
    <div class="TitleStyle">检测</div>
    <a-form  :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
        <a-form-item label="训练数据(data)">
            <a-upload
                :show-upload-list="false"
                @change="handleChange"
                :before-upload="beforeUpload"
            >
                <a-button >上传数据</a-button>
            </a-upload>
            <span style="margin-left:30px;">{{fileUrl}}</span>
        </a-form-item>
        <a-form-item label="训练标签(tag)">
        <template v-for="(tag, index) in tagList" >
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
              <a-tag :key="tag" :closable="index !== 0" class="tagStyle" closable @close="() => handleClose(tag)">
                {{ `${tag.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" class="tagStyle" closable @close="() => handleClose(tag)">
              {{ tag }}
            </a-tag>
          </template>
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="large"
            :style="{ width: '200px',fontSize:'20px',height:'30px' }"
            :value="inputValue"
            @change="handleInputChange"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
          />
          <a-tag v-else style="background: #f7f7f7; border:0px;" @click="showInput">
            <a-icon type="plus-circle" style="font-size:14px;" theme="filled" />
          </a-tag>
        </a-form-item>
        <a-form-item label="训练轮数(epoch)">
        <a-input
            v-model="epoch"
        />
        </a-form-item>
        <a-form-item label="训练批次(Batch_size)">
            <a-input
                v-model="batchSize"
            />
        </a-form-item>
        <a-form-item label="模型学习率(Learning_rate)">
        <a-input
            v-model="learningRate"
        />
        </a-form-item>
        <a-form-item label="">
            <a-button type="danger" @click="endTrain"  class="btnStyle" v-if="training" style="margin-left:30px"> 终止训练</a-button>

            <a-button type="primary" @click="goTrain" :loading="training"  class="btnStyle"> {{training?'训练中...':'开始训练'}}</a-button>

        </a-form-item>
    </a-form>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
        fileUrl:'',
        file:null,
        tagList:[],
        inputVisible: false,
        inputValue: '',
        epoch:300,
        batchSize:4,
        learningRate:0.01,
        training:false,
    };
  },
  methods: {
     handleChange(info) {
      
    },
    beforeUpload(file){
        console.log(file)
        this.file =file
        this.fileUrl =file.name
    },
    //标签
    handleClose(removedTag) {
      const tags = this.tagList.filter(tag => tag !== removedTag)
      this.tagList = tags
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(function() {
        this.$refs.input.focus()
      })
    },
    handleInputChange(e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm() {
      let tags = this.tagList||[];
      const inputValue = this.inputValue;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      console.log(tags);
      this.tagList = tags
      this.inputVisible=false
      this.inputValue=''
    },
    //开始训练
    goTrain(){
        this.training=true
        console.log(this.file,this.epoch,this.batchSize,this.learningRate,this.tagList)
    },
    //结束训练
    endTrain(){
        this.training=false
    }
  },
};
</script>

<style lang="scss" >
.TitleStyle{
    font-size: 30px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 700;
    color: #333333;
    line-height: 50px;
    margin: 10px 0px 50px 10px;
}
    .fontStyle{
        font-size: 24px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
    }
    .btnStyle{
        float: right;
    }
    .tagStyle{
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        background: #FFF;
    }
</style>
