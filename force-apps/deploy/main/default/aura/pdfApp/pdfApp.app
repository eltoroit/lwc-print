<aura:application extends="force:slds">
    <aura:handler name="init" value="{!this}" action="{!c.init}" />
    <aura:attribute name="pdfData" type="String" default="visible" />
    {!v.body}
</aura:application>